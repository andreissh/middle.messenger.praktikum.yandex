import Block from "@/framework/Block";
import { EventsType } from "@/types/types";

type FormProps = {
	[key: string]: unknown;
	attributes: {
		class: string;
	};
	children: string;
	events: EventsType;
};

const template = `
	<form class="{{ class }}">
		{{{ children }}}
	</form>
`;

export default class Form extends Block {
	constructor(props: FormProps) {
		super("div", props);
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
