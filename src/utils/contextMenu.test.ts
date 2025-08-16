import { jest } from "@jest/globals";
import ContextMenu from "@/components/context-menu/ContextMenu";
import {
	renderContextMenu,
	positionContextMenu,
	removeContextMenu,
	showContextMenu,
} from "./contextMenu";

jest.mock("@/components/context-menu/ContextMenu", () =>
	jest.fn().mockImplementation(() => ({
		getContent: jest.fn(() => {
			const div = document.createElement("div");
			div.className = "context-menu";
			return div;
		}),
	}))
);

describe("Context Menu Utilities", () => {
	let mockContextMenu: jest.Mocked<ContextMenu>;

	beforeEach(() => {
		document.body.innerHTML = "";
		mockContextMenu = new ContextMenu({}) as jest.Mocked<ContextMenu>;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("renderContextMenu", () => {
		it("should add context menu to body when not present", () => {
			const spy = jest.spyOn(mockContextMenu, "getContent");
			renderContextMenu(mockContextMenu);

			expect(document.querySelector(".context-menu")).not.toBeNull();
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("should not add context menu if already exists", () => {
			renderContextMenu(mockContextMenu);
			renderContextMenu(mockContextMenu);

			expect(document.querySelectorAll(".context-menu").length).toBe(1);
		});
	});

	describe("positionContextMenu", () => {
		beforeEach(() => {
			renderContextMenu(mockContextMenu);
		});

		it("should position menu within viewport", () => {
			const menu = document.querySelector(".context-menu") as HTMLElement;
			Object.defineProperties(menu, {
				offsetWidth: { value: 200 },
				offsetHeight: { value: 150 },
			});

			positionContextMenu(100, 100);

			expect(menu.style.position).toBe("fixed");
			expect(menu.style.left).toBe("100px");
			expect(menu.style.top).toBe("100px");
			expect(menu.style.zIndex).toBe("1000");
		});

		it("should adjust position when near right edge", () => {
			const menu = document.querySelector(".context-menu") as HTMLElement;
			Object.defineProperties(menu, {
				offsetWidth: { value: 200 },
				offsetHeight: { value: 150 },
			});

			Object.defineProperty(window, "innerWidth", { value: 300 });
			positionContextMenu(150, 100);

			expect(menu.style.left).toBe("95px"); // 300 - 200 - 5
		});

		it("should adjust position when near bottom edge", () => {
			const menu = document.querySelector(".context-menu") as HTMLElement;
			Object.defineProperties(menu, {
				offsetWidth: { value: 200 },
				offsetHeight: { value: 150 },
			});

			Object.defineProperty(window, "innerHeight", { value: 300 });
			positionContextMenu(100, 200);

			expect(menu.style.top).toBe("145px"); // 300 - 150 - 5
		});

		it("should do nothing if menu not found", () => {
			document.body.innerHTML = "";
			positionContextMenu(100, 100);
		});
	});

	describe("removeContextMenu", () => {
		it("should remove existing context menu", () => {
			renderContextMenu(mockContextMenu);
			expect(document.querySelector(".context-menu")).not.toBeNull();

			removeContextMenu();

			expect(document.querySelector(".context-menu")).toBeNull();
		});

		it("should do nothing if no menu exists", () => {
			removeContextMenu();
		});
	});

	describe("showContextMenu", () => {
		it("should show hidden context menu", () => {
			renderContextMenu(mockContextMenu);
			const menu = document.querySelector(".context-menu") as HTMLElement;
			menu.style.display = "none";

			showContextMenu();

			expect(menu.style.display).toBe("block");
		});

		it("should do nothing if no menu exists", () => {
			showContextMenu();
		});
	});
});
