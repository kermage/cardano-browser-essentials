import { identifier } from "../helpers";
import { Connect } from "./connect";

customElements.define(`${identifier(true)}-connect`, Connect, {
	extends: "button",
});
