import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import Input from "@/components/input/Input";
import "./profile-field.css";

export type ProfileFieldProps = {
	id: string;
	label: string;
	type: string;
	name: string;
	autocomplete: string;
	events?: EventsType;
};

const template = `
  <li class="profile-field-item">
    <label for="{{ id }}" class="profile-field-label">{{ label }}</label>
    {{{ Input }}}
  </li>
`;

export default class ProfileField extends Block {
	constructor(props: ProfileFieldProps) {
		super("div", {
			attributes: {
				id: props.id,
			},
			label: props.label,
			Input: new Input({
				attributes: {
					...props,
					class: "profile-field-input",
				},
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
