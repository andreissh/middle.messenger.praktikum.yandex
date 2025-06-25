import Block from "../../framework/Block";

const template = "<div></div>";

export default class ServerErrorPage extends Block {
  constructor(app) {
    super("div");
  }
  render() {
    return this.compile(template);
  }
}
