import {

  Currency,
  NativeCurrency,
  Token,
  WETH9,
} from "sdkcore18";
import { ChainId } from "smartorderrouter18"


// eslint-disable-next-line no-restricted-syntax
export const NATIVE_CHAIN_ID = "NATIVE";

export const DAI_MODE = new Token(
  ChainId.MODE,
  "0x0f117Da8c078B83AD4136f0cF2e5058dAddb1151",
  18,
  "DAI",
  "DAI",
);

export const WBTC_MODE = new Token(
  ChainId.MODE,
  '0x2aB8A15f4E5B19882D6D1aDd1C0Ecf50b3deB8a6',
  8,
  'WBTC',
  'Wrapped Bitcoin'
);

export const USDC_MODE = new Token(
  ChainId.MODE,
  '0x4Cc496ca61683944f20a1C4796761273EE74FB62',
  6,
  'USDC',
  'USD Coin'
);

export const USDT_MODE = new Token(
  ChainId.MODE,
  '0x4E6E66560165771FE0E15435367f8318bA2748Ec',
  6,
  'USDT',
  'Tether USD'
);

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } =
{
  ...(WETH9 as Record<ChainId, Token>),
  [ChainId.MODE]: new Token(
    ChainId.MODE,
    "0x4200000000000000000000000000000000000006",
    18,
    "WETH",
    "Wrapped Ether",
  ),
  
};

class ExtendedEther extends NativeCurrency {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    if (wrapped) return wrapped;
    throw new Error(`Unsupported chain ID: ${this.chainId}`);
  }

  protected constructor(chainId: number) {
    super(chainId, 18, "ETH", "Ethereum");
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } =
    {};

  public static onChain(chainId: number): ExtendedEther {
    return (
      this._cachedExtendedEther[chainId] ??
      (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
    );
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {};
export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId];
  let nativeCurrency: NativeCurrency | Token;
  nativeCurrency = ExtendedEther.onChain(chainId);
  return (cachedNativeCurrency[chainId] = nativeCurrency);
}

export const TOKEN_SHORTHANDS: {
  [shorthand: string]: { [chainId in ChainId]?: string };
} = {
  USDC: {
    [ChainId.MODE]: USDC_MODE.address
  },
};

const STABLECOINS: { [chainId in ChainId]: Token[] } = {
  [ChainId.MODE]: [DAI_MODE, USDC_MODE, USDT_MODE],
};

export function isStablecoin(currency?: Currency): boolean {
  if (!currency) return false;

  return STABLECOINS[currency.chainId as ChainId].some((stablecoin) =>
    stablecoin.equals(currency),
  );
}

export const UNKNOWN_TOKEN_SYMBOL = "UNKNOWN";
export const UNKNOWN_TOKEN_NAME = "Unknown Token";
