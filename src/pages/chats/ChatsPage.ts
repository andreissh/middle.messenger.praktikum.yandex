import Block from "@/framework/Block";
import App from "@/App";
import Link from "@/components/btn/Link";
import arrowIcon from "@/assets/icons/arrow-right.svg";
import ChatList from "./components/chat-list/ChatList";
import "./chats.css";

type ChatConfig = {
  name: string;
  text: string;
  time: string;
  count: string;
};

const chats: ChatConfig[] = [
  { name: "Андрей", text: "Изображение", time: "12:49", count: "2" },
  { name: "Киноклуб", text: "Вы: стикер", time: "12:00", count: "" },
  {
    name: "Илья",
    text: "Друзья, у меня для вас особенный выпуск новостей!...",
    time: "15:12",
    count: "4",
  },
];

const template = `
  <div class="chats-container">
    <aside class="chats-aside">
      <div class="chats-aside-top-section">
        {{{ ProfileLink }}}
        <input
          type="search"
          name="message"
          class="chats-aside-search"
          placeholder="Поиск"
        />
      </div>
      {{{ ChatList }}}
    </aside>
    <main class="chats-main">
      <div class="chats-main-content">
        <span class="chats-main-content-text-default">Выберите чат, чтобы
          отправить сообщение</span>
      </div>
    </main>
  </div>
`;

export default class ChatsPage extends Block {
  constructor(app: App) {
    super("div", {
      ProfileLink: new Link({
        href: "#",
        id: "renderProfileInfoBtn",
        class: "chats-aside-to-profile-btn",
        children: `
          <span class="chats-aside-to-profile-btn-text">Профиль</span>
          <img src="${arrowIcon}" alt="" />
        `,
        events: {
          click: () => {
            app.changePage("ProfileInfoPage");
          },
        },
      }) as Link,
      arrowIcon,
      ChatList: new ChatList({
        chats,
      }) as ChatList,
    });
  }

  render(): HTMLElement {
    return this.compile(template);
  }
}
