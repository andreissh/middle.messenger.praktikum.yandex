import Block from "../../../../framework/Block";
import "./profile-field.css";

const template = `
  <li class="profile-field-item">
    <label for="{{id}}" class="profile-field-label">{{label}}</label>
    <input
      id="{{id}}"
      class="profile-field-input"
      type="{{type}}"
      name="{{name}}"
      value="{{value}}"
      {{#if readonly}}readonly{{/if}}
    />
  </li>
`;

export default class ProfileField extends Block {
  constructor(props) {
    super("div", props);
  }

  render() {
    return this.compile(template);
  }
}
