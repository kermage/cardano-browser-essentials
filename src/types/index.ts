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

export type NetworkName = "mainnet" | "preprod" | "preview";
export type NetworkType = "mainnet" | "testnet";
export type NetworkId = 0 | 1;

export const SLOT_OFFSET = {
	mainnet: 1591566291000,
	preprod: 1655683200000,
	preview: 1666656000000,
} as const;
