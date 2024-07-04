import { toSlotNumber } from ".";
import {
	type CMLModule,
	type CMLType,
	type FullAPI,
	type ProtocolParameters,
} from "./types/index";

let CML: CMLModule;

class Handler {
	#wallet: FullAPI;
	#txBuilder: CMLType.TransactionBuilder;

	constructor(wallet: FullAPI, txBuilder: CMLType.TransactionBuilder) {
		this.#wallet = wallet;
		this.#txBuilder = txBuilder;
	}

	sendTo(address: string, lovelace: string) {
		this.#txBuilder.add_output(
			CML.TransactionOutputBuilder.new()
				.with_address(CML.Address.from_bech32(address))
				.next()
				.with_value(CML.Value.from_coin(BigInt(lovelace)))
				.build(),
		);

		return this;
	}

	registerStake() {
		this.#wallet.getRewardAddresses().then((address) => {
			const parsedAddress = CML.RewardAddress.from_address(
				CML.Address.from_hex(address[0]),
			)!;

			this.#txBuilder.add_cert(
				CML.SingleCertificateBuilder.new(
					CML.Certificate.new_stake_registration(
						CML.Credential.new_pub_key(
							CML.Ed25519KeyHash.from_hex(
								parsedAddress.payment().as_pub_key()!.to_hex(),
							),
						),
					),
				).skip_witness(),
			);
		});
	}

	delegateTo(poolID: string) {
		this.#wallet.getRewardAddresses().then((address) => {
			const parsedAddress = CML.RewardAddress.from_address(
				CML.Address.from_hex(address[0]),
			)!;

			this.#txBuilder.add_cert(
				CML.SingleCertificateBuilder.new(
					CML.Certificate.new_stake_delegation(
						CML.Credential.new_pub_key(
							CML.Ed25519KeyHash.from_hex(
								parsedAddress.payment().as_pub_key()!.to_hex(),
							),
						),
						CML.Ed25519KeyHash.from_bech32(poolID),
					),
				).payment_key(),
			);
		});

		return this;
	}

	async execute(timeout?: number) {
		(await this.#wallet.getUtxos())?.forEach((utxo) => {
			this.#txBuilder.add_input(
				CML.SingleInputBuilder.from_transaction_unspent_output(
					CML.TransactionUnspentOutput.from_cbor_hex(utxo),
				).payment_key(),
			);
		});

		const changeAddress = CML.Address.from_hex(
			await this.#wallet.getChangeAddress(),
		);
		this.#txBuilder.add_change_if_needed(changeAddress, true);

		if (timeout) {
			this.#txBuilder.set_ttl(
				BigInt(
					toSlotNumber(
						Date.now() + timeout * 1000,
						changeAddress.network_id() ? "mainnet" : "preprod",
					),
				),
			);
		}

		const completeTx = this.#txBuilder
			.build(CML.ChangeSelectionAlgo.Default, changeAddress)
			.build_unchecked();
		const txWitness = CML.TransactionWitnessSetBuilder.new();

		txWitness.add_existing(
			CML.TransactionWitnessSet.from_cbor_hex(
				await this.#wallet.signTx(completeTx.to_cbor_hex()),
			),
		);

		return await this.#wallet.submitTx(
			CML.Transaction.new(
				completeTx.body(),
				txWitness.build(),
				true,
				completeTx.auxiliary_data(),
			).to_cbor_hex(),
		);
	}
}

export function createHandler(usingWallet: FullAPI, usingCML: CMLModule) {
	CML = usingCML;

	return {
		configWith(protocolParameters: ProtocolParameters) {
			const txBuilder = CML.TransactionBuilder.new(
				CML.TransactionBuilderConfigBuilder.new()
					.fee_algo(
						CML.LinearFee.new(
							BigInt(protocolParameters.min_fee_a),
							BigInt(protocolParameters.min_fee_b),
						),
					)
					.max_tx_size(protocolParameters.max_tx_size)
					.max_value_size(Number(protocolParameters.max_val_size))
					.key_deposit(BigInt(protocolParameters.key_deposit))
					.pool_deposit(BigInt(protocolParameters.pool_deposit))
					.coins_per_utxo_byte(BigInt(protocolParameters.coins_per_utxo_size!))
					.ex_unit_prices(
						CML.ExUnitPrices.new(
							CML.Rational.new(
								BigInt(protocolParameters.price_mem! * 100_000_000),
								100_000_000n,
							),
							CML.Rational.new(
								BigInt(protocolParameters.price_step! * 100_000_000),
								100_000_000n,
							),
						),
					)
					.collateral_percentage(protocolParameters.collateral_percent!)
					.max_collateral_inputs(protocolParameters.max_collateral_inputs!)
					.build(),
			);

			return new Handler(usingWallet, txBuilder);
		},
	};
}
