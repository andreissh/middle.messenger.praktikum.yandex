import Block from "../../framework/Block";
import "./btn.css";

const template = `
<a href="{{ href }}" id="{{ id }}" class="{{ className }}">
    {{{ child }}}
</a>
`;
export default class Link extends Block {
  constructor(props) {
    super("a", props);
  }
  render() {
    return this.compile(template, this.props);
  }
}
