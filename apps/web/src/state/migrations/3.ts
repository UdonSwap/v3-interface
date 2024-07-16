import { Token } from "sdkcore18";
import { ChainId } from "smartorderrouter18"
import { PersistState } from "redux-persist";
import { UserState } from "state/user/reducer";
import { serializeToken } from "state/user/utils";

export type PersistAppStateV3 = {
  _persist: PersistState;
} & { user?: UserState };

/**
 * Migration to clear users' imported token lists, after
 * breaking changes to token info for multichain native USDC.
 */
export const migration3 = (state: PersistAppStateV3 | undefined) => {
  if (state?.user) {
    // Update USDC.e tokens to use the the new USDC.e symbol (from USDC)
    const USDCe_ADDRESSES: { [key in ChainId]?: string } = {

    };
    for (const [chainId, address] of Object.entries(USDCe_ADDRESSES)) {
      const chainIdKey = Number(chainId) as ChainId;
      if (state.user.tokens?.[chainIdKey]?.[address]) {
        state.user.tokens[chainIdKey][address] = serializeToken(
          new Token(chainIdKey, address, 6, "USDC.e", "Bridged USDC"),
        );
      }
    }
   
    return {
      ...state,
      _persist: {
        ...state._persist,
        version: 3,
      },
    };
  }
  return state;
};
