import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import ProfileField from "../profile-field/ProfileField";
import { InputProps } from "../../utils/profileData";
import "./profile-fields.css";

type ProfileFieldsProps = {
	fields: Array<InputProps & { label: string }>;
	events?: EventsType;
};

const template = `
  <ul class="profile-fields">
    {{{ Fields }}}
  </ul>
`;

export default class ProfileFields extends Block {
	constructor(props: ProfileFieldsProps) {
		super("div", {
			Fields: props.fields.map(
				(field) =>
					new ProfileField({
						...field,
						events: props.events,
					})
			),
		});
	}

	render() {
		return this.compile(template);
	}
}
