import Block from "@/framework/Block";
import "./login-field.css";
import { EventsType } from "@/types/types";
import Input from "@/components/input/Input";
import { InputProps } from "@/pages/profile/utils/profileData";

export type LoginFieldProps = InputProps & { label: string } & {
	events?: EventsType;
};

const template = `
  <li class="login-field-item">
    <label for="{{ id }}" class="login-field-label">{{ label }}</label>
    {{{ Input }}}
  </li>
`;

export default class LoginField extends Block {
	constructor(props: LoginFieldProps) {
		super("div", {
			label: props.label,
			Input: new Input({
				id: props.id,
				class: "login-field-input",
				type: props.type,
				name: props.name,
				autocomplete: props.autocomplete,
				events: props.events,
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
