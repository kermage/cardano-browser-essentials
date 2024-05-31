import { WalletInfo } from "./types";

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

export function getWalletInfo(name: string): WalletInfo {
	if (!isAvailable(name)) {
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
