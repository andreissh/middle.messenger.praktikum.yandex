import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import "./not-found.css";
import router from "@/routes/Router";

const template = `
  <div class="not-found-container">
    <h1 class="not-found-header">404</h1>
    <p class="not-found-description">Не туда попали</p>
    <div class="not-found-goback-container">
      {{{ HomeBtn }}}
    </div>
  </div>
`;

export default class NotFoundPage extends Block {
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
