import "@webreflection/custom-elements-builtin";
import { CustomElement } from "../types/index";
import webcomponents from "../webcomponents/index";

function getName(element: CustomElement): string {
	return `${webcomponents.prefix}-${element.name}`;
}

webcomponents.elements.forEach((element) => {
	const tagName = getName(element);

	if (customElements.get(tagName)) {
		return;
	}

	customElements.define(getName(element), element.constructor, {
		extends: element.extends,
	});
});
