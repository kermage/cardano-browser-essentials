import { defineConfig, type LibraryOptions } from "vite";
import dts from "vite-plugin-dts";

const forCDN = process.env.CDN ? true : false;
const emptyOutDir = !forCDN;
const minify = forCDN;
const lib: LibraryOptions = {
	entry: [
		forCDN
			? process.env.COMPONENTS
				? "src/builds/components.ts"
				: "src/builds/cdn.ts"
			: "src/builds/module.ts",
	],
	formats: [forCDN ? "umd" : "es"],
	name: "CBE",
	fileName: (_, name) => `${name}.js`,
};
const plugins = forCDN ? [] : [dts({ rollupTypes: true })];

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		emptyOutDir,
		lib,
		minify,
	},
	plugins,
});
