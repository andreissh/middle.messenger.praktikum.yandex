import Block from "../../framework/Block";
import "./btn.css";

const template = `
  <a href="{{ href }}" id="{{ id }}" class="{{ class }}">
    {{{ children }}}
  </a>
`;

export default class Link extends Block {
  constructor(props) {
    super("div", props);
  }

  render() {
    return this.compile(template);
  }
}
