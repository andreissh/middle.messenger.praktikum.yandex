import Block from "@/framework/Block";
import closeBtn from "@/assets/icons/close.svg";
import Button from "../button/Button";
import "./modal.css";

type ModalProps = {
	[key: string]: unknown;
	attributes: {
		id: string;
	};
	title: string;
	children: string;
};

const template = `
	<div id="{{ id }}" class="modal-wrapper" style="display: none;">
		<div class="modal">
			<div class="modal-header">
				{{{ CloseBtn }}}
				<h2 class="modal-title">{{ title }}</h2>
			</div>
			<div class="modal-body">
				{{{ children }}}
			</div>
		</div>
	</div>
`;

export default class Modal extends Block {
	constructor(props: ModalProps) {
		super("div", {
			...props,
			CloseBtn: new Button({
				attributes: {
					class: "modal-close-btn",
				},
				children: `
					<img src=${closeBtn} alt="close" />
				`,
				events: {
					click: () => this.handleCloseClick(),
				},
			}),
		});
	}

	private handleCloseClick(): void {
		const modal = document.querySelector<HTMLElement>(
			`#${this.props.attributes!.id}`
		);
		if (!modal) return;

		const inputs = modal.querySelectorAll<HTMLInputElement>("input");
		inputs.forEach((input) => (input.value = ""));
		modal.style.display = "none";
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
