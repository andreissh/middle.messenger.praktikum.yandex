import Block from "@/framework/Block";

type AvatarProps = {
	children: Block | Block[] | string;
	attributes: {
		class: string;
		name?: string;
	};
};

const template = `
	<span class="{{ class }}" name="{{ name }}">
		{{{ children }}}
	</span>
`;

export default class Avatar extends Block {
	constructor(props: AvatarProps) {
		super("div", props);
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
