import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import "./context-menu.css";

type ContextMenuProps = {
	[key: string]: unknown;
	x?: number;
	y?: number;
	children?: string;
	events?: EventsType;
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
