import Block from "../../../../framework/Block";
import "./login-field.css";

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
  constructor(props) {
    super("div", props);
  }
  render() {
    return this.compile(template);
  }
}
