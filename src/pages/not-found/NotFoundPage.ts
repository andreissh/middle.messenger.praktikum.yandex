import Block from "@/framework/Block";
import Button from "@/components/button/Button";
import router from "@/routes/Router";
import "./not-found.css";

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
				attributes: {
					id: "renderChatsBtn",
					class: "btn-secondary",
				},
				children: "Назад к чатам",
				events: {
					click: () => NotFoundPage.handleHomeClick(),
				},
			}),
		});
	}

	private static handleHomeClick(): void {
		router.go("/messenger");
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
