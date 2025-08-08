import Block from "@/framework/Block";
import { EventsType } from "@/types/types";

type TInputProps = {
	attributes: {
		id: string;
		class: string;
		type: string;
		name: string;
		value?: string;
		autocomplete: string;
		placeholder?: string;
		readonly?: boolean;
	};
	events?: EventsType;
};

const template = `
  <input
    id="{{ id }}"
    class="{{ class }}"
    type="{{ type }}"
    name="{{ name }}"
    value="{{ value }}"
    placeholder="{{ placeholder }}"
    autocomplete="{{ autocomplete }}"
    {{#if readonly}}readonly{{/if}}
  />
`;

export default class Input extends Block {
	constructor(props: TInputProps) {
		super("div", props);
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
