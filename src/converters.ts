const hexes = Array.from({ length: 256 }, (_, i) =>
	i.toString(16).padStart(2, "0"),
);

export const Hex = {
	encode: (value: Uint8Array) => {
		return value.reduce((acc, byte) => acc + hexes[byte], "");
	},

	decode: (value: string) => {
		return new Uint8Array(
			value.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [],
		);
	},
};

export const UInt8 = {
	encode: (value: string) => {
		return new TextEncoder().encode(value);
	},

	decode: (value: Uint8Array) => {
		return new TextDecoder("utf-8", { ignoreBOM: true }).decode(value);
	},
};

export const String = {
	encode: (data: string) => {
		return Hex.encode(UInt8.encode(data));
	},

	decode: (data: string) => {
		return UInt8.decode(Hex.decode(data));
	},
};
