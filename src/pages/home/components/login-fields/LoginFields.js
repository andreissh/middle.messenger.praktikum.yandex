import Block from "../../../../framework/Block";
import LoginField from "../login-field/LoginField";
import "./login-fields.css";

const template = `
  <ul class="login-field-list">
    {{{ fields }}}
  </ul>
`;

export default class LoginFields extends Block {
  constructor(props) {
    super("div", {
      fields: props.fields.map((field) => new LoginField(field)),
    });
  }

  render() {
    return this.compile(template);
  }
}
