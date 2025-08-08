import Block from "@/framework/Block";

export default function renderDOM(
	query: string,
	block: Block,
	didMount: boolean = false
) {
	const root = document.querySelector(query);
	if (!root) {
		throw new Error(`Не найден корневой элемент: "${query}"`);
	}

	root.innerHTML = "";
	root.appendChild(block.getContent());

	if (!didMount) {
		block.dispatchComponentDidMount();
	}
}
