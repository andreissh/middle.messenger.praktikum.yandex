import Block from "@/framework/Block";

type AvatarProps = {
	attributes?: {
		class?: string;
		name?: string;
	};
	children: string;
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
