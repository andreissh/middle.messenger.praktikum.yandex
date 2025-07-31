import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import "./context-menu.css";

type ContextMenuProps = {
	x?: number;
	y?: number;
	events?: EventsType;
	children?: Block | Block[] | string;
	[key: string]: unknown;
};

const contextMenuTemplate = `
  <div class="context-menu" style="left: {{ x }}px; top: {{ y }}px;">
    {{{ children }}}
  </div>
`;

export default class ContextMenu extends Block {
	constructor(props: ContextMenuProps) {
		super("div", props);
	}

	render(): HTMLElement {
		return this.compile(contextMenuTemplate);
	}
}
