import Block from "../../../../framework/Block";
import ProfileField from "../profile-field/ProfileField";
import "./profile-fields-list.css";

const template = `
  <ul class="profile-fields-list">
    {{{ fields }}}
  </ul>
`;

export default class ProfileFieldsList extends Block {
  constructor(props) {
    super("div", {
      fields: props.fields.map((field) => new ProfileField(field)),
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
