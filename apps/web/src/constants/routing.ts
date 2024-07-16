// a list of tokens by chain
import { Currency, Token } from "sdkcore18";
import { ChainId } from "smartorderrouter18";
import {
  WRAPPED_NATIVE_CURRENCY,
  DAI_MODE,
  USDC_MODE,
  USDT_MODE,
  WBTC_MODE,
  nativeOnChain,
} from "./tokens";

type ChainTokenList = {
  readonly [chainId: number]: Token[];
};

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[];
};

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean),
);

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [ChainId.MODE]: [
    nativeOnChain(ChainId.MODE),
    DAI_MODE,
    USDC_MODE,
    USDT_MODE,
    WBTC_MODE,
    WRAPPED_NATIVE_CURRENCY[ChainId.MODE] as Token,
  ],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
};
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } =
  {};
