import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import Input from "@/components/input/Input";
import { InputProps } from "../../utils/profileData";
import "./profile-field.css";

export type ProfileFieldProps = InputProps & { label: string } & {
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
			label: props.label,
			Input: new Input({
				...props,
				events: props.events,
				id: props.id,
				type: props.type,
				name: props.name,
				autocomplete: props.autocomplete,
				class: "profile-field-input",
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
