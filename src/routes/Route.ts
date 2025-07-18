import Block from "@/framework/Block";
import renderDOM from "@/utils/renderDOM";

interface RouteProps {
	rootQuery: string;
}

class Route {
	private _pathname: string;

	private _blockClass: new () => Block;

	private _block: Block | null;

	private _props: RouteProps;

	constructor(pathname: string, view: new () => Block, props: RouteProps) {
		this._pathname = pathname;
		this._blockClass = view;
		this._block = null;
		this._props = props;
	}

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	leave() {
		if (this._block) {
			this._block.hide();
		}
	}

	match(pathname: string) {
		return pathname === this._pathname;
	}

	render() {
		this._block = new this._blockClass();
		renderDOM(this._props.rootQuery, this._block);
	}
}

export default Route;
