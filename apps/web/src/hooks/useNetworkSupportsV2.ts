import { useWeb3React } from '@web3-react/core'
import { FeatureFlags } from 'uniswap/src/features/experiments/flags'
import { useFeatureFlag } from 'uniswap/src/features/experiments/hooks'

export function useNetworkSupportsV2() {
  const { chainId } = useWeb3React()
  const isV2EverywhereEnabled = useFeatureFlag(FeatureFlags.V2Everywhere)

  return (
    chainId && false
    
  )
}
