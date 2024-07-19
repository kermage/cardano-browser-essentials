import "//cdn.jsdelivr.net/npm/alpinejs/dist/cdn.min.js";
import "/src/builds/components.ts";
import * as CBE from "/src/index.ts";

window.CBE = CBE;

(async function () {
	const $list = document.querySelector("#cbE-events");

	[
		"added",
		"removed",
		"adopted",
		"initialized",
		"connecting",
		"connected",
		"error",
	].forEach((type) => {
		addEventListener(`CardanoWebComponents:${type}`, (event) => {
			const template = document.createElement("template");

			template.innerHTML = `<li><b>${event.type}</b><pre>${JSON.stringify(
				event.detail,
				null,
				2,
			)}</pre></li>`;

			$list.appendChild(template.content.childNodes[0]);
			console.info("[CBE]", event.type, event.detail);
		});
	});

	if (
		!/eruda=true/.test(window.location) &&
		localStorage.getItem("active-eruda") !== "true"
	) {
		return;
	}
	await import("//cdn.jsdelivr.net/npm/eruda");
	eruda.init();
})();
