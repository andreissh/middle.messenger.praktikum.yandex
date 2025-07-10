import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import "./server-error.css";
import { router } from "@/routes/Router";

const template = `
  <div class="server-error-container">
    <h1 class="server-error-header">500</h1>
    <p class="server-error-description">Мы уже фиксим</p>
    <div class="server-error-goback-container">
      {{{ HomeLink }}}
    </div>
  </div>
`;

export default class ServerErrorPage extends Block {
	constructor() {
		super("div", {
			HomeLink: new Link({
				href: "#",
				id: "renderChatsBtn",
				class: "btn-secondary",
				children: "Назад к чатам",
				events: {
					click: () => router.go("/chats"),
				},
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
