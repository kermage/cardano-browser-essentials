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

import type * as CMLType from "@dcspark/cardano-multiplatform-lib-browser";

export type { CMLType };
export type CMLModule = typeof CMLType;

export interface ProtocolParameters {
	min_fee_a: number;
	min_fee_b: number;
	max_tx_size: number;
	key_deposit: string;
	pool_deposit: string;
	price_mem: number | null;
	price_step: number | null;
	max_val_size: string | null;
	collateral_percent: number | null;
	max_collateral_inputs: number | null;
	coins_per_utxo_size: string | null;
}

export type NetworkName = "mainnet" | "preprod" | "preview";
export type NetworkType = "mainnet" | "testnet";
export type NetworkId = 0 | 1;

export const SLOT_OFFSET = {
	mainnet: 1591566291000,
	preprod: 1655683200000,
	preview: 1666656000000,
} as const;
