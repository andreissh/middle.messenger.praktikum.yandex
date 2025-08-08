import ContextMenu from "@/components/context-menu/ContextMenu";

export function renderContextMenu(menu: ContextMenu): void {
	const contextMenu = document.querySelector<HTMLElement>(".context-menu");
	if (!contextMenu) {
		document.body.appendChild(menu.getContent());
	}
}

export function positionContextMenu(x: number, y: number): void {
	const contextMenu = document.querySelector<HTMLElement>(".context-menu");
	if (!contextMenu) return;

	const menuElement = contextMenu;
	const menuWidth = menuElement.offsetWidth;
	const menuHeight = menuElement.offsetHeight;
	const windowWidth = window.innerWidth;
	const windowHeight = window.innerHeight;

	const adjustedX =
		x + menuWidth > windowWidth ? windowWidth - menuWidth - 5 : x;
	const adjustedY =
		y + menuHeight > windowHeight ? windowHeight - menuHeight - 5 : y;

	menuElement.style.position = "fixed";
	menuElement.style.left = `${adjustedX}px`;
	menuElement.style.top = `${adjustedY}px`;
	menuElement.style.zIndex = "1000";
}

export function removeContextMenu(): void {
	const contextMenu = document.querySelector<HTMLElement>(".context-menu");
	if (!contextMenu) return;

	contextMenu.remove();
}

export function showContextMenu(): void {
	const contextMenu = document.querySelector<HTMLElement>(".context-menu");
	if (!contextMenu) return;

	contextMenu.style.display = "block";
}
