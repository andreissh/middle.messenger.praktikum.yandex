import Block from "../../framework/Block";

const template = `
<button id="{{ id }}" class="{{ className }}">
    {{{ child }}}
</button>
`;

export default class Button extends Block {
  constructor(props) {
    super("button", props);
  }
  render() {
    return this.compile(template, this.props);
  }
}
