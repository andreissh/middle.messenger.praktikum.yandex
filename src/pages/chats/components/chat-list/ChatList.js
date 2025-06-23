import Block from "../../../../framework/Block";
import "./chat-list.css";

const template = `
<ul class="chat-list">
  {{#each chats}}
    {{#ChatItem
      name=this.name text=this.text time=this.time count=this.count
    }}{{/ChatItem}}
  {{/each}}
</ul>

`;

export default class ChatList extends Block {
  constructor(props) {
    super("ul", props);
  }
  render() {
    return this.compile(template, this.props);
  }
}
