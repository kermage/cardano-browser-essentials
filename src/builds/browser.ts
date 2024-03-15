import "../connect";
import { getInstalledWallets, isAvailable, isCIP30 } from "../index";

// @ts-ignore
window.CBU = {
	isCIP30,
	isAvailable,
	getInstalledWallets,
};
