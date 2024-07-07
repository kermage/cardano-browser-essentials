# Cardano Browser Essentials

## Usage

```html
<button is="cwc-connect" wallet="nami">Connect to Nami</button>
```

> Change `wallet` attribute value to any CIP30 compliant namespace

### Events

- CardanoWebComponents:added
- CardanoWebComponents:removed
- CardanoWebComponents:adopted
- CardanoWebComponents:initialized
- CardanoWebComponents:connecting
- CardanoWebComponents:connected
- CardanoWebComponents:error

| Detail    | Description         |
| --------- | ------------------- |
| button    | the current element |
| wallet    | ID, name, and icon  |
| api\*     | CIP30 Full API      |
| error\*\* | error object thrown |

> \*_Available only in `connected`_
>
> \*\*_Available only in `error`_

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
  window.CBE.enableWallet(name);
  window.CBE.toSlotNumber(timestamp, network);
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
  enableWallet,
  toSlotNumber,
} from "cardano-browser-essentials";

import "cardano-browser-essentials/components";
```

### Transactions

```ts
import { createHandler } from "cardano-browser-essentials";

// const { fullAPI: walletAPI } = await enableWallet(namespace)
const walletAPI = event.detail.api; // from connected
const txHandler = createHandler(walletAPI, await CML.load());
async function getLatestParameters(): Promise<ProtocolParameters> {}

const txHash = txHandler
  .configWith(await getLatestParameters())
  .sendTo("bech32_address", "lovelace_amount")
  .delegateTo("bech32_pool_ID")
  .registerStake()
  .execute(); // optional timeout in seconds
```
