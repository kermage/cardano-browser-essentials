import {
	getInstalledWallets,
	getWalletInfo,
	isAvailable,
	isCIP30,
} from "../index";
import "./components";

// @ts-ignore
window.CBU = {
	isCIP30,
	isAvailable,
	getInstalledWallets,
	getWalletInfo,
};
