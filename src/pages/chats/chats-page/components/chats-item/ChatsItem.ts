import { resourcesUrl } from "@/utils/utils";
import Block from "@/framework/Block";
import ContextMenu from "@/components/context-menu/ContextMenu";
import router from "@/routes/Router";
import avatarImg from "@/assets/icons/avatar-img.svg";
import Button from "@/components/button/Button";
import Avatar from "@/components/avatar/Avatar";
import deleteImg from "@/assets/icons/delete.svg";
import {
	positionContextMenu,
	removeContextMenu,
	renderContextMenu,
	showContextMenu,
} from "@/utils/contextMenu";
import "./chats-item.css";

export type ChatsItemProps = {
	attributes: {
		id: string;
	};
	name: string;
	text: string;
	time: string;
	count: number;
	avatar: string;
	active?: boolean | null;
};

const template = `
  <li id="{{ id }}" class="chat-item{{#if active}} chat-item--active{{/if}}">
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
      <button class="chat-item-delete-btn">
		<img src="${deleteImg}" alt="delete" />
      </button>
    </div>
  </li>
`;

export default class ChatsItem extends Block {
	constructor(props: ChatsItemProps) {
		super("div", {
			...props,
			Avatar: new Avatar({
				attributes: {
					class: "chat-item-avatar",
				},
				children: `
					<img src=${
						props.avatar ? resourcesUrl + props.avatar : avatarImg
					} alt="chatIcon" />
				`,
			}),
			ContextMenu: new ContextMenu({}),
			events: {
				click: (e?: Event) => this.handleChatItemClick(e),
				contextmenu: (e?: Event) => this.handleContextMenu(e),
			},
		});

		document.addEventListener("click", removeContextMenu);
	}

	private showDeleteChatModal = (): void => {
		const modal = document.querySelector<HTMLElement>("#deleteChatModal");
		if (!modal) return;

		sessionStorage.setItem("chatId", String(this.props.attributes!.id));
		modal.style.display = "block";
	};

	private handleChatItemClick(e?: Event): void {
		const target = e?.target as HTMLElement;
		const deleteBtn = target.closest(".chat-item-delete-btn");
		const chatId = window.location.pathname.split("/").pop();

		if (deleteBtn) {
			this.showDeleteChatModal();
		} else {
			const { id } = this.props.attributes!;
			if (id !== chatId) {
				router.go(`/messenger/${id}`);
			}
		}
	}

	private handleContextMenu(e?: Event) {
		e?.preventDefault();
		const mouseEvent = e as MouseEvent;

		const menu = new ContextMenu({
			x: mouseEvent.clientX,
			y: mouseEvent.clientY,
			children: `
					{{{ DeleteBtn }}}
				 `,
			DeleteBtn: new Button({
				attributes: {
					class: "context-menu-delete-btn",
				},
				children: "Удалить",
			}),
			events: {
				click: () => this.showDeleteChatModal(),
			},
		});

		this.setProps({
			ContextMenu: menu,
		});

		renderContextMenu(menu);
		positionContextMenu(mouseEvent.clientX, mouseEvent.clientY);
		showContextMenu();
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
