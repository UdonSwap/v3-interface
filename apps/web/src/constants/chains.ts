import { ChainId } from "smartorderrouter18";

const SUPPORTED_CHAINS = [ChainId.MODE] as const;

type SupportedChainsType = (typeof SUPPORTED_CHAINS)[number];

export enum SupportedChainId {
  MODE = 919,
}

export const CHAIN_IDS_TO_NAMES = {
  [ChainId.MODE]: "mode",
} as const;

// TODO: include BASE_GOERLI, OPTIMISM_SEPOLIA, or ARBITRUM_SEPOLIA when routing is implemented
export type SupportedInterfaceChain = SupportedChainsType;

export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = Object.values(ChainId).filter(
  (id) => typeof id === "number",
) as ChainId[];

export function isSupportedChain(
  chainId: number | null | undefined,
): chainId is ChainId {
  return !!chainId && !!ChainId[chainId];
}

export function asSupportedChain(
  chainId: number | null | undefined | ChainId,
  featureFlags?: Record<number, boolean>,
): SupportedInterfaceChain | undefined {
  if (!chainId) return undefined;
  if (featureFlags && chainId in featureFlags && !featureFlags[chainId]) {
    return undefined;
  }
  return isSupportedChain(chainId) ? chainId : undefined;
}

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [ChainId.MODE] as const;

/**
 * @deprecated when v2 pools are enabled on chains supported through sdk-core
 */
export const UNSUPPORTED_V2POOL_CHAIN_IDS = [ChainId.MODE] as const;

export const TESTNET_CHAIN_IDS = [] as const;

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [] as const;

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number];

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [ChainId.MODE] as const;

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];

/**
 * Get the priority of a chainId based on its relevance to the user.
 * @param {ChainId} chainId - The chainId to determine the priority for.
 * @returns {number} The priority of the chainId, the lower the priority, the earlier it should be displayed, with base of MAINNET=0.
 */
export function getChainPriority(chainId: ChainId): number {
  switch (chainId) {
    case ChainId.MODE:
      return 0;
    default:
      return Infinity;
  }
}
