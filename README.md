# Cardano Browser Essentials

## Usage

```html
<button is="cwc-connect" wallet="nami">Connect to Nami</button>
```

> Change `wallet` attribute value to any CIP30 compliant namespace

### CDN

- [unpkg](https://unpkg.com/cardano-browser-essentials/dist/cdn.js)
- [jsDelivr](https://cdn.jsdelivr.net/npm/cardano-browser-essentials/dist/cdn.js)

```html
<script>
	window.CBE.isCIP30(wallet);
	window.CBE.isAvailable(wallet);
	window.CBE.getInstalledWallets();
	window.CBE.getEnabledWallets();
	window.CBE.getWalletInfo(name);
</script>
```

> No global/window **CBE** object

- [unpkg](https://unpkg.com/cardano-browser-essentials/dist/components.js)
- [jsDelivr](https://cdn.jsdelivr.net/npm/cardano-browser-essentials/dist/components.js)

### Builds

```ts
// index.d.ts
import type { InjectedCardano } from "cardano-browser-essentials";

declare global {
	interface Window extends InjectedCardano {}
}

// index.ts
import {
	isCIP30,
	isAvailable,
	getInstalledWallets,
	getEnabledWallets,
	getWalletInfo,
} from "cardano-browser-essentials";

import "cardano-browser-essentials/components";
```
