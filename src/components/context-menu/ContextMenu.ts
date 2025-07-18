import Block from "@/framework/Block";
import "./context-menu.css";

type ContextMenuProps = {
	x: number;
	y: number;
	onDelete: () => void;
};

const contextMenuTemplate = `
  <div class="context-menu" style="left: {{x}}px; top: {{y}}px;">
    <button class="context-menu-delete-btn">Удалить</button>
  </div>
`;

export default class ContextMenu extends Block {
	constructor(props: ContextMenuProps) {
		super("div", {
			...props,
			events: {
				click: (e: Event) => {
					const target = e.target as HTMLElement;
					if (target.classList.contains("context-menu-delete-btn")) {
						props.onDelete();
					}
				},
			},
		});
	}

	render(): HTMLElement {
		return this.compile(contextMenuTemplate);
	}
}
