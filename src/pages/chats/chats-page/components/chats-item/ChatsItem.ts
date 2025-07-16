import Block from "@/framework/Block";
import ContextMenu from "@/components/context-menu/ContextMenu";
import http from "@/api/http";
import "./chats-item.css";
import { router } from "@/routes/Router";

export type ChatsItemProps = {
	id: number;
	name: string;
	text: string;
	time: string;
	count: string;
};

const template = `
  <li id="{{ id }}" class="chat-item">
    <span class="chat-item-avatar"></span>
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
	private static currentOpenMenu: ContextMenu | null = null;

	constructor(props: ChatsItemProps) {
		super("div", {
			...props,
			events: {
				click: (e?: Event) => this.handleChatItemClick(e),
				contextmenu: (e?: Event) => this.handleContextMenu(e),
			},
		});

		document.addEventListener("click", (e) => {
			const target = e.target as Node;
			const isClickInsideMenu = this.contextMenu?.getContent().contains(target);
			const isClickInsideChatItem = this.getContent().contains(target);

			if (!isClickInsideMenu && !isClickInsideChatItem) {
				this.closeContextMenu();
			}
		});
	}

	handleChatItemClick(e?: Event): void {
		const chatItems = document.querySelectorAll(".chat-item");
		let chatId;
		chatItems.forEach((item) => {
			if (item.contains(e.target)) {
				chatId = item.id;
			}
		});
		if (!chatId) return;

		router.go(`/messenger/${chatId}`);
	}

	handleContextMenu(e: Event) {
		e.preventDefault();
		const mouseEvent = e as MouseEvent;

		if (ChatsItem.currentOpenMenu) {
			ChatsItem.currentOpenMenu.getContent().remove();
			ChatsItem.currentOpenMenu = null;
		}

		this.contextMenu = new ContextMenu({
			x: mouseEvent.clientX,
			y: mouseEvent.clientY,
			onDelete: async () => {
				console.log(`Удаление чата с ID: ${this.props.id}`);
				try {
					await http.delete("/chats", {
						body: {
							chatId: this.props.id,
						},
					});
					this.closeContextMenu();
				} catch (err) {
					console.log(err);
				}
			},
		});

		ChatsItem.currentOpenMenu = this.contextMenu;

		document.body.appendChild(this.contextMenu.getContent());
		this.positionContextMenu(mouseEvent.clientX, mouseEvent.clientY);
	}

	positionContextMenu(x: number, y: number) {
		if (!this.contextMenu) return;

		const menuElement = this.contextMenu.getContent();
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

	closeContextMenu() {
		if (this.contextMenu) {
			this.contextMenu.getContent().remove();
			this.contextMenu = null;
			ChatsItem.currentOpenMenu = null;
		}
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
