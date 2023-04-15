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

export function getInstalledWallets(): string[] {
	if (!isAvailable()) {
		return [];
	}

	return Object.keys(window.cardano).filter(isCIP30);
}
