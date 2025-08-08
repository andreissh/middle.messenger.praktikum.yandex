import Block from "@/framework/Block";
import { EventsType, FieldProps } from "@/types/types";
import Field from "../field/Field";
import "./fields.css";

type FieldsProps = {
	attributes?: {
		class: string;
		liClass: string;
		labelClass: string;
		inputClass: string;
	};
	fields: FieldProps[];
	events?: EventsType;
};

const template = `
  <ul class="{{ class }}">
    {{{ Fields }}}
  </ul>
`;

export default class Fields extends Block {
	constructor(props: FieldsProps) {
		const { attributes } = props;

		super("div", {
			class: attributes ? attributes.class : "",
			Fields: props.fields.map(
				(field) =>
					new Field({
						attributes: {
							liClass: attributes ? attributes.liClass : "",
							labelClass: attributes ? attributes.labelClass : "",
							inputClass: attributes ? attributes.inputClass : "",
						},
						...field,
						events: props.events,
					})
			),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
