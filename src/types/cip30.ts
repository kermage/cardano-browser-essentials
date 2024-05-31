type cbor<_T> = string;
type Bytes = string;
type hash32 = string;
type Address = cbor<"Address">;

interface Paginate {
	page: number;
	limit: number;
}

interface DataSignature {
	signature: cbor<"COSE_Sign1">;
	key: cbor<"COSE_Key">;
}

export interface FullAPI {
	getNetworkId: () => Promise<number>;
	getUtxos: (
		amount?: cbor<"value">,
		paginate?: Paginate
	) => Promise<cbor<"TransactionUnspentOutput">[] | null>;
	getCollateral: (params?: {
		amount: cbor<"Coin">;
	}) => Promise<cbor<"TransactionUnspentOutput">[] | null>;
	getBalance: () => Promise<cbor<"value">>;
	getUsedAddresses: (paginate?: Paginate) => Promise<Address[]>;
	getUnusedAddresses: () => Promise<Address[]>;
	getChangeAddress: () => Promise<Address>;
	getRewardAddresses: () => Promise<Address[]>;
	signTx: (
		tx: cbor<"transaction">,
		partialSign?: boolean
	) => Promise<cbor<"transaction_witness_set">>;
	signData: (addr: Address, payload: Bytes) => Promise<DataSignature>;
	submitTx: (tx: cbor<"transaction">) => Promise<hash32>;
}

export interface InitialAPI {
	enable: () => Promise<FullAPI>;
	isEnabled: () => Promise<boolean>;
	apiVersion: string;
	name: string;
	icon: string;
}
