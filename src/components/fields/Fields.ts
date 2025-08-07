import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import { InputProps } from "@/pages/profile/utils/profileData";
import Field from "../field/Field";
import "./fields.css";

type FieldsProps = {
	fields: Array<InputProps & { label: string }>;
	events?: EventsType;
};

const template = `
  <ul class="fields-list">
    {{{ Fields }}}
  </ul>
`;

export default class Fields extends Block {
	constructor(props: FieldsProps) {
		super("div", {
			Fields: props.fields.map(
				(field) => new Field({ ...field, events: props.events })
			),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
