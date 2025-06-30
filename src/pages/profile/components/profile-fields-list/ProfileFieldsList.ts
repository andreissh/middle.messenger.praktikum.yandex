import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import ProfileField from "../profile-field/ProfileField";
import "./profile-fields-list.css";
import { InputProps } from "../../utils/profileData";

type ProfileFieldsProps = {
	fields: Array<InputProps & { label: string }>;
	events?: EventsType;
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
