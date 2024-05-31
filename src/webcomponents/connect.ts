import { namespacedEvent } from "../helpers";
import { getWalletInfo, isAvailable } from "../index";
import { FullAPI } from "../types";

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

			this.dispatchEvent(
				namespacedEvent("connecting", {
					button: this,
					wallet: getWalletInfo(wallet),
				})
			);

			window.cardano[wallet]
				.enable()
				.then((api: FullAPI) => {
					this.dispatchEvent(
						namespacedEvent("connected", { wallet: getWalletInfo(wallet), api })
					);
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
