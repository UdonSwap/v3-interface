import { ChainId } from "smartorderrouter18";
import AppJsonRpcProvider from "rpc/AppJsonRpcProvider";

import ConfiguredJsonRpcProvider from "rpc/ConfiguredJsonRpcProvider";
import { CHAIN_IDS_TO_NAMES, SupportedInterfaceChain } from "./chains";
import { APP_RPC_URLS } from "./networks";

function getAppProvider(chainId: SupportedInterfaceChain) {
  return new AppJsonRpcProvider(
    APP_RPC_URLS[chainId].map(
      (url) =>
        new ConfiguredJsonRpcProvider(url, {
          chainId,
          name: CHAIN_IDS_TO_NAMES[chainId],
        }),
    ),
  );
}

/** These are the only JsonRpcProviders used directly by the interface. */
export const RPC_PROVIDERS = {
  [ChainId.MODE]: getAppProvider(ChainId.MODE),
 
} satisfies Record<SupportedInterfaceChain, AppJsonRpcProvider>;
