import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import "./button.css";

type ButtonProps = {
	id?: string;
	class?: string;
	children?: Block | Block[] | string;
	events?: EventsType;
	type?: string;
	[key: string]: unknown;
};

const template = `
  <button type="{{ type }}" id="{{ id }}" class="{{ class }}">
    {{{ children }}}
  </button>
`;

export default class Button extends Block {
	constructor(props: ButtonProps) {
		super("div", props);
	}

	render() {
		return this.compile(template);
	}
}
