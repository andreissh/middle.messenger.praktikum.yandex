import Block from "@/framework/Block";
import { EventsType } from "@/types/types";
import Input from "@/components/input/Input";
import "./field.css";

export type FieldProps = {
	id: string;
	label: string;
	type: string;
	name: string;
	autocomplete: string;
	events?: EventsType;
	[key: string]: unknown;
};

const template = `
  <li class="field-item">
    <label for="{{ id }}" class="field-label">{{ label }}</label>
    {{{ Input }}}
  </li>
`;

export default class Field extends Block {
	constructor(props: FieldProps) {
		const { events, ...plainProps } = props;

		super("div", {
			attributes: {
				id: plainProps.id,
			},
			label: plainProps.label,
			Input: new Input({
				attributes: {
					...plainProps,
					class: "field-input",
				},
				events,
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
