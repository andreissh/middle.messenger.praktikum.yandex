import Block from "@/framework/Block";

type AvatarProps = {
	class: string;
	name?: string;
	children: Block | Block[] | string;
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
