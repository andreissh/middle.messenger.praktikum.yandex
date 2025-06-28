import Block from "@/framework/Block";
import "./profile-field.css";

export type ProfileFieldProps = {
	id: string;
	label: string;
	type: string;
	name: string;
	value?: string;
};

const template = `
  <li class="profile-field-item">
    <label for="{{ id }}" class="profile-field-label">{{ label }}</label>
    <input
      id="{{ id }}"
      class="profile-field-input"
      type="{{ type }}"
      name="{{ name }}"
      value="{{ value }}"
			autocomplete="{{ autocomplete }}"
      {{#if readonly}}readonly{{/if}}
    />
  </li>
`;

export default class ProfileField extends Block {
	constructor(props: ProfileFieldProps) {
		super("div", props);
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
