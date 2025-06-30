import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import { InputProps } from "@/pages/profile/utils/profileData";
import LoginField from "../login-field/LoginField";
import "./login-fields.css";

type LoginFieldsProps = {
	fields: Array<InputProps & { label: string }>;
	events?: EventsType;
};

const template = `
  <ul class="login-field-list">
    {{{ fields }}}
  </ul>
`;

export default class LoginFields extends Block {
	constructor(props: LoginFieldsProps) {
		super("div", {
			fields: props.fields.map(
				(field) => new LoginField({ ...field, events: props.events })
			),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
