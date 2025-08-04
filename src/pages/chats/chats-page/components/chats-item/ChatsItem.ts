import Block from "@/framework/Block";
import ContextMenu from "@/components/context-menu/ContextMenu";
import router from "@/routes/Router";
import avatarImg from "@/assets/icons/avatar-img.svg";
import Button from "@/components/button/Button";
import Avatar from "@/components/avatar/Avatar";
import "./chats-item.css";

export type ChatsItemProps = {
	id: number;
	name: string;
	text: string;
	time: string;
	count: number;
};

const template = `
  <li id="{{ id }}" class="chat-item">
    {{{ Avatar }}}
    <div class="chat-item-content-block">
      <h5 class="chat-item-header">{{ name }}</h5>
      <p class="chat-item-message">{{ text }}</p>
    </div>
    <div class="chat-item-info-block">
      <span class="chat-item-msg-time">{{ time }}</span>
      {{#if count}}
        <span class="chat-item-msg-count">{{ count }}</span>
      {{/if}}
    </div>
  </li>
`;

export default class ChatsItem extends Block {
	constructor(props: ChatsItemProps) {
		super("div", {
			...props,
			Avatar: new Avatar({
				class: "chat-item-avatar",
				children: `
					<img src=${avatarImg} alt="chatIcon" />
				`,
			}),
			ContextMenu: new ContextMenu({}),
			events: {
				click: () => this.handleChatItemClick(),
				contextmenu: (e?: Event) => this.handleContextMenu(e),
			},
		});

		document.addEventListener("click", ChatsItem.removeContextMenu);
	}

	private showDeleteChatModal = (): void => {
		const modal = document.querySelector<HTMLElement>("#deleteChatModal");
		if (!modal) return;

		sessionStorage.setItem("chatId", String(this.props.id));
		modal.style.display = "block";
	};

	private handleChatItemClick(): void {
		router.go(`/messenger/${this.props.id}`);
	}

	private handleContextMenu(e?: Event) {
		e?.preventDefault();
		const mouseEvent = e as MouseEvent;

		this.setProps({
			ContextMenu: new ContextMenu({
				children: `
					{{{ DeleteBtn }}}
				 `,
				DeleteBtn: new Button({
					class: "context-menu-delete-btn",
					children: "Удалить",
				}),
				x: mouseEvent.clientX,
				y: mouseEvent.clientY,
				events: {
					click: () => this.showDeleteChatModal(),
				},
			}),
		});

		this.renderContextMenu();
		ChatsItem.positionContextMenu(mouseEvent.clientX, mouseEvent.clientY);

		const contextMenu = document.querySelector<HTMLElement>(".context-menu");
		if (!contextMenu) return;
		contextMenu.style.display = "block";
	}

	private renderContextMenu() {
		const contextMenu = document.querySelector<HTMLElement>(".context-menu");
		if (!contextMenu) {
			document.body.appendChild(this.children.ContextMenu.getContent());
		}
	}

	private static positionContextMenu(x: number, y: number) {
		const contextMenu = document.querySelector<HTMLElement>(".context-menu");
		if (!contextMenu) return;

		const menuElement = contextMenu;
		const menuWidth = menuElement.offsetWidth;
		const menuHeight = menuElement.offsetHeight;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		const adjustedX =
			x + menuWidth > windowWidth ? windowWidth - menuWidth - 5 : x;
		const adjustedY =
			y + menuHeight > windowHeight ? windowHeight - menuHeight - 5 : y;

		menuElement.style.position = "fixed";
		menuElement.style.left = `${adjustedX}px`;
		menuElement.style.top = `${adjustedY}px`;
		menuElement.style.zIndex = "1000";
	}

	private static removeContextMenu() {
		const contextMenu = document.querySelector<HTMLElement>(".context-menu");
		if (!contextMenu) return;

		contextMenu.remove();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
