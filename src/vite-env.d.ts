/// <reference types="vite/client" />

declare global {
	interface Window {
		cardano: Record<string, InjectedAPI>;
	}
}

export default null;
