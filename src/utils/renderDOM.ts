import Block from "@/framework/Block";

function renderDOM(query: string, block: Block) {
	const root = document.querySelector(query);
	if (!root) throw new Error(`Root not found with selector "${query}"`);

	root.innerHTML = "";

	root.appendChild(block.getContent());

	block.dispatchComponentDidMount();
}

export default renderDOM;
