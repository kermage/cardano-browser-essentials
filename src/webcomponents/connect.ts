import { namespacedEvent } from "../helpers";
import { getWalletInfo, isAvailable } from "../index";

import type { FullAPI } from "../types/index";

export class Connect extends HTMLButtonElement {
	#initialized: boolean = false;
	#wallet: string = "";

	#eventCallback(name: string) {
		this.dispatchEvent(
			namespacedEvent(name, {
				button: this,
				wallet: getWalletInfo(this.#wallet),
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

		if (this.#initialized) {
			return;
		}

		this.#initialized = true;
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
					this.dispatchEvent(
						namespacedEvent("connected", {
							wallet: getWalletInfo(wallet),
							api,
						}),
					);
				})
				.catch((error: any) => {
					this.dispatchEvent(
						namespacedEvent("error", { wallet: getWalletInfo(wallet), error }),
					);
				})
				.finally(() => {
					this.disabled = false;
				});
		});
	}
}
