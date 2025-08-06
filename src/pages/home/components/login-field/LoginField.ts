import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import Input from "@/components/input/Input";
import "./login-field.css";

export type LoginFieldProps = {
	id: string;
	label: string;
	type: string;
	name: string;
	autocomplete: string;
	events?: EventsType;
	[key: string]: unknown;
};

const template = `
  <li class="login-field-item">
    <label for="{{ id }}" class="login-field-label">{{ label }}</label>
    {{{ Input }}}
  </li>
`;

export default class LoginField extends Block {
	constructor(props: LoginFieldProps) {
		const { events, ...plainProps } = props;

		super("div", {
			attributes: {
				id: plainProps.id,
			},
			label: plainProps.label,
			Input: new Input({
				attributes: {
					...plainProps,
					class: "login-field-input",
				},
				events,
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
