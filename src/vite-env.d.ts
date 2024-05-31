/// <reference types="vite/client" />

import { InitialAPI } from "types/index";

declare global {
	interface Window {
		cardano: Record<string, InitialAPI>;
	}
}

export default null;
