const template = "<div></div>";

export default class ProfileEditPage extends Block {
  constructor(app) {
    super("div");
  }
  render() {
    return this.compile(template);
  }
}
