import Block from "../../framework/Block";
import "./btn.css";

const template = `{{{ child }}}`;
export default class Link extends Block {
  constructor(props) {
    super("a", {
      ...props,
      attributes: {
        href: props.href || "#",
        id: props.id,
        class: props.className,
      },
    });
  }
  render() {
    return this.compile(template);
  }
}
