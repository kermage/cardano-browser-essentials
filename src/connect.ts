import { identifier, namespacedEvent } from "./helpers";
import { isAvailable } from "./index";
import { InjectedAPI } from "./types";

export class Connect extends HTMLButtonElement {
	async connectedCallback() {
		const wallet = this.getAttribute("wallet");

		this.disabled = wallet
			? !isAvailable(wallet) || (await window.cardano[wallet].isEnabled())
			: true;

		if (!wallet) {
			return;
		}

		this.addEventListener("click", async () => {
			this.disabled = true;

			this.dispatchEvent(namespacedEvent("connecting", { wallet }));

			window.cardano[wallet]
				.enable()
				.then((api: InjectedAPI) => {
					this.dispatchEvent(namespacedEvent("connected", api));
				})
				.catch((error: any) => {
					this.dispatchEvent(namespacedEvent("error", error));
					this.disabled = false;
				});
		});
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

customElements.define(`${identifier(true)}-connect`, Connect, {
	extends: "button",
});
