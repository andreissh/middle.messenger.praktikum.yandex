import "./server-error.css";
import Link from "../../components/btn/Link";
import Block from "../../framework/Block";

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
