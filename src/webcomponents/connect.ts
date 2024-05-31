import { namespacedEvent } from "../helpers";
import { getWalletInfo, isAvailable } from "../index";
import { FullAPI } from "../types";

export class Connect extends HTMLButtonElement {
	#wallet: string = "";

	#eventCallback(name: string) {
		this.dispatchEvent(
			namespacedEvent(name, {
				button: this,
				wallet: getWalletInfo(this.#wallet),
			})
		);
	}

	async connectedCallback() {
		this.#wallet = this.getAttribute("wallet") ?? "";
		this.disabled = this.#wallet ? !isAvailable(this.#wallet) : true;

		if (!this.#wallet) {
			return;
		}

		this.#eventCallback("added");
		this.addEventListener("click", async () => {
			const wallet = this.#wallet;
			this.disabled = true;

			this.#eventCallback("connecting");
			window.cardano[wallet]
				.enable()
				.then((api: FullAPI) => {
					this.dispatchEvent(
						namespacedEvent("connected", { wallet: getWalletInfo(wallet), api })
					);
				})
				.catch((error: any) => {
					this.dispatchEvent(
						namespacedEvent("error", { wallet: getWalletInfo(wallet), error })
					);
				})
				.finally(() => {
					this.disabled = false;
				});
		});
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
		if ("wallet" !== name || oldValue) {
			return;
		}

		this.connectedCallback();
	}
}
