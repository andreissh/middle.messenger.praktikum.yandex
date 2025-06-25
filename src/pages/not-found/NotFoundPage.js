const template = "<div></div>";

export default class NotFoundPage extends Block {
  constructor(app) {
    super("div");
  }
  render() {
    return this.compile(template);
  }
}
