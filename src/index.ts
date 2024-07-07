import { SLOT_OFFSET } from "./types/index";

import type { FullAPI, NetworkName, WalletInfo } from "./types/index";

export * from "./transaction";

export function isCIP30(wallet: string): boolean {
	return (
		"function" === typeof window.cardano[wallet].enable &&
		"function" === typeof window.cardano[wallet].isEnabled &&
		"string" === typeof window.cardano[wallet].apiVersion &&
		"string" === typeof window.cardano[wallet].name &&
		"string" === typeof window.cardano[wallet].icon
	);
}

export function isAvailable(wallet: string = ""): boolean {
	if (
		"undefined" === typeof window ||
		"undefined" === typeof window.cardano ||
		("" !== wallet && "undefined" === typeof window.cardano[wallet])
	) {
		return false;
	}

	return wallet ? isCIP30(wallet) : true;
}

export function getInstalledWallets(): WalletInfo[] {
	if (!isAvailable()) {
		return [];
	}

	return Object.keys(window.cardano).filter(isCIP30).map(getWalletInfo);
}

export function getEnabledWallets(): Promise<WalletInfo[]> {
	return getInstalledWallets().reduce(
		async (acc, wallet) => {
			if (await window.cardano[wallet.id].isEnabled()) {
				(await acc).push(wallet);
			}

			return acc;
		},
		Promise.resolve([] as WalletInfo[]),
	);
}

export function getWalletInfo(name: string): WalletInfo {
	if ("" === name || !isAvailable(name)) {
		return {
			id: "",
			name: "",
			icon: "",
		};
	}

	return {
		id: name,
		name: window.cardano[name].name,
		icon: window.cardano[name].icon,
	};
}

export function enableWallet(
	name: string,
): Promise<{ fullAPI: FullAPI; networkID: number }> {
	return new Promise((resolve, reject) => {
		if ("" === name || !isAvailable(name)) {
			reject(new Error(`The wallet name "${name}" is not CIP30 compliant.`));
		}

		window.cardano[name]
			.enable()
			.then(async (fullAPI) => {
				const networkID = await fullAPI.getNetworkId();

				resolve({ fullAPI, networkID });
			})
			.catch((error: any) => {
				reject(error);
			});
	});
}

export function toSlotNumber(timestamp: number, network: NetworkName) {
	return Math.floor((timestamp - SLOT_OFFSET[network]) / 1000);
}
