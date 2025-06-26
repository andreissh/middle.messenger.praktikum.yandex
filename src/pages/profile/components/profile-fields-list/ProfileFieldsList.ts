import Block from "@/framework/Block";
import ProfileField, { ProfileFieldProps } from "../profile-field/ProfileField";
import "./profile-fields-list.css";

type ProfileFieldsProps = {
  fields: ProfileFieldProps[];
};

const template = `
  <ul class="profile-fields-list">
    {{{ fields }}}
  </ul>
`;

export default class ProfileFieldsList extends Block {
  constructor(props: ProfileFieldsProps) {
    super("div", {
      fields: props.fields.map((field) => new ProfileField(field)),
    });
  }

  render() {
    return this.compile(template);
  }
}
