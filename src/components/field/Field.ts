import Block from "@/framework/Block";
import { TFieldProps } from "@/types/types";
import Input from "@/components/input/Input";
import "./field.css";

const template = `
  <li class="{{ liClass }}">
    <label for="{{ id }}" class="{{ labelClass }}">{{ label }}</label>
    {{{ Input }}}
  </li>
`;

export default class Field extends Block {
	constructor(props: TFieldProps) {
		const { events, label, attributes, ...inputProps } = props;

		super("div", {
			liClass: attributes ? attributes.liClass : "",
			id: inputProps.id,
			labelClass: attributes ? attributes.labelClass : "",
			label,
			Input: new Input({
				attributes: {
					...inputProps,
					class: attributes ? attributes.inputClass : "",
				},
				events,
			}),
		});
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
