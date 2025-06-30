import Block from "@/framework/Block";
import Link from "@/components/btn/Link";
import "./not-found.css";
import { PageProps } from "@/types/types";

const template = `
  <div class="not-found-container">
    <h1 class="not-found-header">404</h1>
    <p class="not-found-description">Не туда попали</p>
    <div class="not-found-goback-container">
      {{{ HomeLink }}}
    </div>
  </div>
`;

export default class NotFoundPage extends Block {
	constructor(props: PageProps) {
		super("div", {
			HomeLink: new Link({
				href: "#",
				id: "renderChatsBtn",
				class: "btn-secondary",
				children: "Назад к чатам",
				events: {
					click: () => props.onChangePage("ChatsPage"),
				},
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
