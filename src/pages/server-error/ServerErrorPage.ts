import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import "./server-error.css";
import router from "@/routes/Router";

const template = `
  <div class="server-error-container">
    <h1 class="server-error-header">500</h1>
    <p class="server-error-description">Мы уже фиксим</p>
    <div class="server-error-goback-container">
      {{{ HomeBtn }}}
    </div>
  </div>
`;

export default class ServerErrorPage extends Block {
	constructor() {
		super("div", {
			HomeBtn: new Button({
				id: "renderChatsBtn",
				class: "btn-secondary",
				children: "Назад к чатам",
				events: {
					click: (e) => this.handleHomeClick(e),
				},
			}),
		});
	}

	handleHomeClick(e?: Event): void {
		e?.preventDefault();
		router.go("/messenger");
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
