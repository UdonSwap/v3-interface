import { NativeCurrency, Token } from "sdkcore18";
import { ChainId } from "smartorderrouter18"
import { nativeOnChain } from "constants/tokens";
import { useMemo } from "react";

export default function useNativeCurrency(
  chainId: ChainId | null | undefined,
): NativeCurrency | Token {
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
        nativeOnChain(ChainId.MODE),
    [chainId],
  );
}
