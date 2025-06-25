const template = "<div></div>";

export default class ChatsPage extends Block {
  constructor(app) {
    super("div");
  }
  render() {
    return this.compile(template);
  }
}
