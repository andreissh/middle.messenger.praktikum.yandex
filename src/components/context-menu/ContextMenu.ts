import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import "./context-menu.css";
import Button from "../button/Button";

type ContextMenuProps = {
	x?: number;
	y?: number;
	events?: EventsType;
};

const contextMenuTemplate = `
  <div class="context-menu" style="left: {{ x }}px; top: {{ y }}px;">
    {{{ DeleteBtn }}}
  </div>
`;

export default class ContextMenu extends Block {
	constructor(props: ContextMenuProps) {
		super("div", {
			...props,
			DeleteBtn: new Button({
				class: "context-menu-delete-btn",
				children: "Удалить",
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(contextMenuTemplate);
	}
}
