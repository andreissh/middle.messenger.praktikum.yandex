import { EventBus } from "./EventBus.ts";
import { v4 as makeUUID } from "uuid";
import Handlebars from "handlebars";

type Children = Record<string, Block>;
type Lists = Record<string, Block[] | string[]>;
type Attributes = Record<string, string | boolean>;
type EventsType = Record<string, (e?: Event) => void>;

type BlockMeta = {
  tagName: string;
  props: Props;
};

type Props = {
  [key: string]: any;
  attributes?: Attributes;
  events?: EventsType;
};

class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  private _element: HTMLElement;
  private _meta: BlockMeta;
  private readonly _id: string;
  private _eventBus: EventBus;
  private _props: Props;
  protected children: Children;
  protected lists: Lists;

  constructor(tagName: string = "div", propsAndChildren: Props = {}) {
    const eventBus = new EventBus();
    const { children, props, lists } = this._getChildren(propsAndChildren);

    this._eventBus = eventBus;
    this.children = children;
    this.lists = lists;
    this._meta = {
      tagName,
      props,
    };
    this._id = makeUUID();
    this._props = this._makePropsProxy({ ...props, __id: this._id });
    this._registerEvents(eventBus);

    this._eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildren(propsAndChildren: Props): {
    children: Children;
    props: Props;
    lists: Lists;
  } {
    const children: Children = {};
    const props: Props = {};
    const lists: Lists = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props, lists };
  }

  private _makePropsProxy(props: Props): Props {
    const self = this;
    return new Proxy(props, {
      get(target: Props, prop: string) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target: Props, prop: string, value: any) {
        target[prop] = value;
        self._eventBus.emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      },
    });
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init(): void {
    this._createResources();

    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _createResources(): void {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);

    if (this._props.attributes) {
      Object.entries(this._props.attributes).forEach(([name, value]) => {
        if (value !== undefined && value !== false) {
          const attrValue = value === true ? "" : String(value);
          this._element.setAttribute(name, attrValue);
        }
      });
    }
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    const element = document.createElement(tagName);
    return element;
  }

  private _render(): void {
    const block = this.render();

    this._removeEvents();
    this._element = block;
    this._addEvents();
  }

  protected render(): HTMLElement {
    throw new Error("Render method must be implemented");
  }

  private _addEvents(): void {
    const { events = {} } = this._props;
    if (!this._element) return;

    Object.entries(events).forEach(([eventName, handler]) => {
      if (typeof handler === "function") {
        this._element.addEventListener(eventName, handler);
      }
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this._props;
    if (!this._element) return;

    Object.entries(events).forEach(([eventName, handler]) => {
      this._element.removeEventListener(eventName, handler);
    });
  }

  protected compile(template: string): HTMLElement {
    const propsAndStubs = { ...this._props };
    const tmpId = Math.floor(100000 + Math.random() * 900000);

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement(
      "template"
    ) as HTMLTemplateElement;
    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([, child]) => {
      const listFragment = this._createDocumentElement(
        "template"
      ) as HTMLTemplateElement;
      child.forEach((item) => {
        if (item instanceof Block) {
          listFragment.content.append(item.getContent());
        } else {
          listFragment.content.append(`${item}`);
        }
      });
      const stub = fragment.content.querySelector(`[data-id="__l_${tmpId}"]`);
      if (stub) {
        stub.replaceWith(listFragment.content);
      }
    });

    const fragmentElem = fragment.content.firstElementChild;

    if (!fragmentElem) {
      throw new Error("Compiled template returned empty result");
    }

    if (!(fragmentElem instanceof HTMLElement)) {
      throw new Error("Compiled template returned non-HTML element");
    }

    return fragmentElem;
  }

  public getContent(): HTMLElement {
    if (!this._element) {
      throw new Error("Element not initialized");
    }
    return this._element;
  }

  private _componentDidMount(oldProps: Props): void {
    this.componentDidMount(oldProps);

    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  protected componentDidMount(oldProps: Props): void {}

  protected dispatchComponentDidMount(): void {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);

    if (shouldUpdate) {
      this._render();
    }
  }

  protected componentDidUpdate(oldProps: Props, newProps: Props): boolean {
    return true;
  }

  public get props(): Props {
    return this._props;
  }

  public setProps = (nextProps: Props): void => {
    if (!nextProps) {
      return;
    }

    Object.assign(this._props, nextProps);
    this._eventBus.emit(Block.EVENTS.FLOW_CDU, this._props, nextProps);
  };

  public get element(): HTMLElement | null {
    return this._element;
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "block";
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "none";
    }
  }
}

export default Block;
