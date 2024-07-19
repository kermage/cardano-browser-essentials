class CML {
	static Module;

	static async load() {
		if (undefined === CML.Module) {
			CML.Module = await import("@dcspark/cardano-multiplatform-lib-browser");
		}

		return CML.Module;
	}
}

async function getLatestParameters(networkID, project_id) {
	const network = networkID ? "mainnet" : "preprod";
	const response = await fetch(
		`https://cardano-${network}.blockfrost.io/api/v0/epochs/latest/parameters`,
		{
			headers: {
				Accept: "application/json",
				project_id,
			},
		},
	);

	return await response.json();
}

window.CBE_TX = {
	CML,
	getLatestParameters,
};
