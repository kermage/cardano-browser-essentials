/// <reference types="vite/client" />

import type { InjectedCardano } from "./types/index";

declare global {
	interface Window extends InjectedCardano {}
}

export default null;
