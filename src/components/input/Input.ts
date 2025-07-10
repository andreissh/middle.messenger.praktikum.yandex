import Block from "@/framework/Block";
import { InputProps } from "@/pages/profile/utils/profileData";
import "./input.css";

const template = `
    <input
      id="{{ id }}"
      class="{{ class }}"
      type="{{ type }}"
      name="{{ name }}"
      value="{{ value }}"
	  autocomplete="{{ autocomplete }}"
      {{#if readonly}}readonly{{/if}}
    />
`;

export default class Input extends Block {
	constructor(props: InputProps) {
		super("div", props);
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
