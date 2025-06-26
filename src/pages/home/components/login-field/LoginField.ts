import Block from "@/framework/Block";
import "./login-field.css";

export type LoginFieldProps = {
  id: string;
  label: string;
  type: string;
  name: string;
};

const template = `
  <li class="login-field-item">
    <label for="{{ id }}" class="login-field-label">{{ label }}</label>
    <input
      id="{{ id }}"
      class="login-field-input"
      type="{{ type }}"
      name="{{ name }}"
    />
  </li>
`;

export default class LoginField extends Block {
  constructor(props: LoginFieldProps) {
    super("div", props);
  }

  render(): HTMLElement {
    return this.compile(template);
  }
}
