/// <reference types="vite/client" />

import { InjectedAPI } from "types";

declare global {
	interface Window {
		cardano: Record<string, InjectedAPI>;
	}
}

export default null;
