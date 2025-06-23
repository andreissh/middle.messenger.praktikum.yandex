import Block from "../../../../framework/Block";
import "./profile-field.css";

const template = `
<li class="profile-field-item">
  <label class="profile-field-label" for="{{id}}">{{label}}</label>
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
    super("li", props);
  }
  render() {
    return this.compile(template, this.props);
  }
}
