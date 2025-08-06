import Block from "@/framework/Block";

type FormProps = {
	attributes: {
		class: string;
	};
	[key: string]: unknown;
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
