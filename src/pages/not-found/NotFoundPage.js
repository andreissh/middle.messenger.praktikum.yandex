import "./not-found.css";
import Link from "../../components/btn/Link";
import Block from "../../framework/Block";

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
  constructor(app) {
    super("div", {
      HomeLink: new Link({
        href: "#",
        id: "renderChatsBtn",
        class: "btn-secondary",
        text: "Назад к чатам",
        events: {
          click: () => {
            app.changePage("ChatsPage");
          },
        },
      }),
    });
  }
  render() {
    return this.compile(template);
  }
}
