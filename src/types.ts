export interface InjectedAPI {
	enable: () => Promise<FullAPI>;
	isEnabled: () => Promise<boolean>;
	apiVersion: string;
	name: string;
	icon: string;
}

export type FullAPI = {
	[key in CIP30Functions]: Function;
};

type CIP30Functions =
	| "getNetworkId"
	| "getUtxos"
	| "getCollateral"
	| "getBalance"
	| "getUsedAddresses"
	| "getUnusedAddresses"
	| "getChangeAddress"
	| "getRewardAddresses"
	| "signTx"
	| "signData"
	| "submitTx";

export interface WalletInfo {
	id: string;
	name: string;
	icon: string;
}
