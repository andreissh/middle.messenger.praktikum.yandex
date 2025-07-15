import Block from "@/framework/Block";
import closeBtn from "@/assets/icons/close.png";
import "./modal.css";
import Button from "../button/Button";

type ModalProps = {
	id: string;
	title?: string;
	children?: Block | Block[] | string;
};

const template = `
	<div id="{{ id }}" class="modal-wrapper" style="display: none;">
		<div class="modal">
            <div class="modal-header">
                {{{ CloseBtn }}}
                <h2 class="modal-title">{{ title }}</h2>
            </div>
            <div class="modal-body>
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
				class: "modal-close-btn",
				children: `
                    <img src=${closeBtn} alt="close" />
                `,
				events: {
					click: (e?: Event) => this.handleCloseClick(e),
				},
			}),
		});
	}

	private handleCloseClick(e?: Event): void {
		e?.preventDefault();
		const modal: HTMLElement | null =
			document.querySelector("#createChatModal");
		if (!modal) return;
		modal.style.display = "none";
	}

	render(): HTMLElement {
		return this.compile(template);
	}
}
