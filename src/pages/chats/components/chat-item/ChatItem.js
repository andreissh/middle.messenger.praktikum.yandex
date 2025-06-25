import Block from "../../../../framework/Block";
import "./chat-item.css";

const template = `
  <li class="chat-item">
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

export default class ChatItem extends Block {
  constructor(props) {
    super("div", props);
  }

  render() {
    return this.compile(template);
  }
}
