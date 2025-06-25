import { EventBus } from "./EventBus.js";
import { v4 as makeUUID } from "uuid";
import Handlebars from "handlebars";

class Block {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  _element = null;
  _meta = null;
  _id = null;
  _eventBus = null;
  _props = null;

  constructor(tagName = "div", propsAndChildren = {}) {
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

  _getChildren(propsAndChildren) {
    const children = {};
    const props = {};
    const lists = {};

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

  _makePropsProxy(props) {
    const self = this;
    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        target[prop] = value;
        self._eventBus.emit(Block.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty() {
        throw new Error("Нет доступа");
      },
    });
  }

  _registerEvents(eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  init() {
    this._createResources();

    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);

    if (this._props.attributes) {
      Object.entries(this._props.attributes).forEach(([name, value]) => {
        if (value) this._element.setAttribute(name, value);
      });
    }
  }

  _createDocumentElement(tagName) {
    const element = document.createElement(tagName);
    return element;
  }

  _render() {
    const block = this.render();

    this._removeEvents();
    this._element = block;
    this._addEvents();
  }

  render() {
    console.log("override this method");
  }

  _addEvents() {
    const { events = {} } = this._props;
    if (!this._element) return;

    Object.entries(events).forEach(([eventName, handler]) => {
      if (typeof handler === "function") {
        this._element.addEventListener(eventName, handler);
      }
    });
  }

  _removeEvents() {
    const { events = {} } = this._props;
    if (!this._element) return;

    Object.entries(events).forEach(([eventName, handler]) => {
      this._element.removeEventListener(eventName, handler);
    });
  }

  compile(template) {
    const propsAndStubs = { ...this._props };
    const tmpId = Math.floor(100000 + Math.random() * 900000);

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.entries(this.lists).forEach(([key]) => {
      propsAndStubs[key] = `<div data-id="__l_${tmpId}"></div>`;
    });

    const fragment = this._createDocumentElement("template");
    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    Object.entries(this.lists).forEach(([, child]) => {
      const listFragment = this._createDocumentElement("template");
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

    return fragment.content.firstElementChild;
  }

  getContent() {
    return this._element;
  }

  _componentDidMount() {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      child.dispatchComponentDidMount();
    });
  }

  componentDidMount(oldProps) {}

  dispatchComponentDidMount() {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps, newProps) {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);

    if (shouldUpdate) {
      this._render();
    }
  }

  componentDidUpdate(oldProps, newProps) {
    return true;
  }

  get props() {
    return this._props;
  }

  setProps = (nextProps) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this._props, nextProps);
    this._eventBus.emit(Block.EVENTS.FLOW_CDU, this._props, nextProps);
  };

  get element() {
    return this._element;
  }

  show() {
    this.getContent().style.display = "block";
  }

  hide() {
    this.getContent().style.display = "none";
  }
}

export default Block;
