import { namespacedEvent } from "../helpers";
import { getWalletInfo, isAvailable } from "../index";

import type { FullAPI } from "../types/index";

export class Connect extends HTMLButtonElement {
	#initialized: boolean = false;
	#wallet: string = "";

	#eventCallback(name: string, detail?: any) {
		this.dispatchEvent(
			namespacedEvent(name, {
				button: this,
				wallet: getWalletInfo(this.#wallet),
				...detail,
			}),
		);
	}

	connectedCallback() {
		this.#eventCallback("added");
	}

	disconnectedCallback() {
		this.#eventCallback("removed");
	}

	adoptedCallback() {
		this.#eventCallback("adopted");
	}

	static get observedAttributes() {
		return ["wallet"];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if ("wallet" !== name) {
			return;
		}

		this.#wallet = this.getAttribute("wallet") ?? "";
		this.disabled = this.#wallet ? !isAvailable(this.#wallet) : true;

		if (!this.#wallet || this.#initialized) {
			return;
		}

		this.#initialized = true;
		this.#eventCallback("initialized");
		this.addEventListener("click", async () => {
			const wallet = this.#wallet;
			this.disabled = true;

			if ("" === wallet || !isAvailable(wallet)) {
				return;
			}

			this.#eventCallback("connecting");
			window.cardano[wallet]
				.enable()
				.then((api: FullAPI) => {
					this.#eventCallback("connected", { api });
				})
				.catch((error: any) => {
					this.#eventCallback("error", { error });
				})
				.finally(() => {
					this.disabled = false;
				});
		});
	}

	constructor() {
		super();
		window.addEventListener("load", () => {
			this.setAttribute("wallet", this.#wallet);
		});
	}
}
