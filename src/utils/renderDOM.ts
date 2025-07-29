import Block from "@/framework/Block";

function renderDOM(query: string, block: Block, didMount: boolean = false) {
	const root = document.querySelector(query);
	if (!root) throw new Error(`Root not found with selector "${query}"`);

	root.innerHTML = "";

	root.appendChild(block.getContent());

	if (!didMount) {
		block.dispatchComponentDidMount();
	}
}

export default renderDOM;
