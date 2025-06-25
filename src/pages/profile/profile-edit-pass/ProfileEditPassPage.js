const template = "<div></div>";

export default class ProfileEditPassPage extends Block {
  constructor(app) {
    super("div");
  }
  render() {
    return this.compile(template);
  }
}
