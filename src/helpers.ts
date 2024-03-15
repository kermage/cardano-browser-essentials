export function identifier(short: boolean = false) {
	return short ? "cwc" : "CardanoWebComponents";
}

export function namespacedEvent(name: string, detail: any): CustomEvent {
	return new CustomEvent(`${identifier()}:${name}`, {
		bubbles: true,
		cancelable: false,
		detail,
	});
}
