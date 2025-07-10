import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import "./btn.css";

type LinkProps = {
	href: string;
	id?: string;
	class?: string;
	children?: Block | Block[] | string;
	events?: EventsType;
};

const template = `
  <a href="{{ href }}" id="{{ id }}" class="{{ class }}">
    {{{ children }}}
  </a>
`;

export default class Link extends Block {
	constructor(props: LinkProps) {
		super("div", props);
	}

	render() {
		return this.compile(template);
	}
}
