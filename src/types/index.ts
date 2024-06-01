export * from "./cip30";

export interface WalletInfo {
	id: string;
	name: string;
	icon: string;
}

export interface CustomElement {
	name: string;
	constructor: CustomElementConstructor;
	extends?: string;
}

export interface WebComponents {
	prefix: string;
	elements: CustomElement[];
}
