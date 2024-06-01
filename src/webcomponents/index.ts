import { identifier } from "../helpers";
import { Connect } from "./connect";

import type { WebComponents } from "../types/index";

export default <WebComponents>{
	prefix: identifier(true),
	elements: [
		{
			name: "connect",
			constructor: Connect,
			extends: "button",
		},
	],
};
