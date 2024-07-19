import { defineConfig, type LibraryOptions } from "vite";
import dts from "vite-plugin-dts";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

const forCDN = process.env.CDN ? true : false;
const emptyOutDir = !forCDN && !process.env.COMMON;
const minify = forCDN;
const lib: LibraryOptions = {
	entry: [
		forCDN
			? process.env.COMPONENTS
				? "src/builds/components.ts"
				: "src/builds/cdn.ts"
			: "src/builds/module.ts",
	],
	formats: [forCDN ? "umd" : process.env.COMMON ? "cjs" : "es"],
	name: "CBE",
	fileName: (_, name) => {
		const prefix = process.env.COMMON ? "c" : forCDN ? "" : "m";
		return `${name}.${prefix}js`;
	},
};
const plugins = forCDN ? [] : [dts({ rollupTypes: true })];
const config = process.env.STATIC
	? {
			base: process.env.BASE_URL || "/",
			build: {
				emptyOutDir,
				rollupOptions: {
					input: ["index.html", "examples/index.html"],
				},
			},
			plugins: [wasm(), topLevelAwait()],
		}
	: {
			build: {
				lib,
				emptyOutDir,
				minify,
			},
			plugins,
		};

// https://vitejs.dev/config/
export default defineConfig(config);
