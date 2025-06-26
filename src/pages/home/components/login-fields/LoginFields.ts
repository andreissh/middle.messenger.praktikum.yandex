import Block from "@/framework/Block";
import LoginField, { LoginFieldProps } from "../login-field/LoginField";
import "./login-fields.css";

type LoginFieldsProps = {
  fields: LoginFieldProps[];
};

const template = `
  <ul class="login-field-list">
    {{{ fields }}}
  </ul>
`;

export default class LoginFields extends Block {
  constructor(props: LoginFieldsProps) {
    super("div", {
      fields: props.fields.map((field) => new LoginField(field)),
    });
  }

  render(): HTMLElement {
    return this.compile(template);
  }
}
