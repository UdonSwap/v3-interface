import { useWeb3React } from "@web3-react/core";
import { BagStatus } from "nft/types";
import {
  buildNftTradeInputFromBagItems,
  recalculateBagUsingPooledAssets,
} from "nft/utils";

import { buildRouteResponse } from "nft/utils/nftRoute";
import { useCallback, useMemo } from "react";
import { useNftRouteLazyQuery } from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

import { useBag } from "./useBag";
import { usePurchaseAssets } from "./usePurchaseAssets";
import { useTokenInput } from "./useTokenInput";

export function useFetchAssets(): () => Promise<void> {
  const { account } = useWeb3React();

  const {
    itemsInBag: uncheckedItemsInBag,

    didOpenUnavailableAssets,
    setDidOpenUnavailableAssets,
    isLocked: bagIsLocked,
    setLocked: setBagLocked,
    setItemsInBag,
  } = useBag(
    ({
      itemsInBag,

      didOpenUnavailableAssets,
      setDidOpenUnavailableAssets,
      isLocked,
      setLocked,
      setItemsInBag,
    }) => ({
      itemsInBag,

      didOpenUnavailableAssets,
      setDidOpenUnavailableAssets,
      isLocked,
      setLocked,
      setItemsInBag,
    }),
  );
  const tokenTradeInput = useTokenInput((state) => state.tokenTradeInput);
  const itemsInBag = useMemo(
    () => recalculateBagUsingPooledAssets(uncheckedItemsInBag),
    [uncheckedItemsInBag],
  );

  const [fetchGqlRoute] = useNftRouteLazyQuery();
  const purchaseAssets = usePurchaseAssets();

  const resetStateBeforeFetch = useCallback(() => {
    didOpenUnavailableAssets && setDidOpenUnavailableAssets(false);
    !bagIsLocked && setBagLocked(true);
  }, [
    bagIsLocked,
    didOpenUnavailableAssets,
    setBagLocked,

    setDidOpenUnavailableAssets,
  ]);

  return useCallback(async () => {
    resetStateBeforeFetch();

    fetchGqlRoute({
      variables: {
        senderAddress: account ? account : "",
        nftTrades: buildNftTradeInputFromBagItems(itemsInBag),
        tokenTrades: tokenTradeInput ? tokenTradeInput : undefined,
      },
      onCompleted: (data) => {
        if (!data.nftRoute || !data.nftRoute.route) {
          setBagLocked(false);
          return;
        }

        const purchasingWithErc20 = !!tokenTradeInput;
        const { route, routeResponse } = buildRouteResponse(
          data.nftRoute,
          purchasingWithErc20,
        );

        setBagLocked(false);
      },
    });
  }, [
    account,
    fetchGqlRoute,
    itemsInBag,
    purchaseAssets,
    resetStateBeforeFetch,
    setBagLocked,

    setItemsInBag,
    tokenTradeInput,
  ]);
}
