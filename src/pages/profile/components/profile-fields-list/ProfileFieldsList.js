import Block from "../../../../framework/Block";
import "./profile-fields-list.css";

const template = `
<ul class="profile-fields-list">
  {{#each profileFields}}
    {{#ProfileField
      id=this.id
      label=this.label
      type=this.type
      name=this.name
      value=this.value
      readonly=this.readonly
    }}{{/ProfileField}}
  {{/each}}
</ul>
`;

export default class ProfileFieldsList extends Block {
  constructor(props) {
    super("ul", props);
  }
  render() {
    return this.compile(template, this.props);
  }
}
