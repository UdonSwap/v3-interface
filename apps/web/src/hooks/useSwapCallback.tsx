import { Percent, TradeType } from "sdkcore18";
import { useWeb3React } from "@web3-react/core";
import { PermitSignature } from "hooks/usePermitAllowance";
import { useCallback } from "react";
import {
  InterfaceTrade,
} from "state/routing/types";
import { isClassicTrade } from "state/routing/utils";
import { useAddOrder } from "state/signatures/hooks";
import { useTransactionAdder } from "../state/transactions/hooks";
import {
  ExactInputSwapTransactionInfo,
  ExactOutputSwapTransactionInfo,
  TransactionType,
} from "../state/transactions/types";
import { currencyId } from "../utils/currencyId";
import { useUniversalRouterSwapCallback } from "./useUniversalRouter";
import useTransactionDeadline from "./useTransactionDeadline";

export type SwapResult = Awaited<
  ReturnType<ReturnType<typeof useSwapCallback>>
>;

// Returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: InterfaceTrade | undefined, // trade to execute, required
  fiatValues: { amountIn?: number; amountOut?: number; feeUsd?: number }, // usd values for amount in and out, and the fee value, logged for analytics
  allowedSlippage: Percent, // in bips
  permitSignature: PermitSignature | undefined,
) {
  const deadline = useTransactionDeadline();
  const addTransaction = useTransactionAdder();
  const addOrder = useAddOrder();
  const { account, chainId } = useWeb3React();


  const universalRouterSwapCallback = useUniversalRouterSwapCallback(
    isClassicTrade(trade) ? trade : undefined,
    fiatValues,
    {
      slippageTolerance: allowedSlippage,
      permit: permitSignature,
    },
  );

  const swapCallback = universalRouterSwapCallback;

  return useCallback(async () => {
    if (!trade) throw new Error("missing trade");
    if (!account || !chainId)
      throw new Error("wallet must be connected to swap");

    const result = await swapCallback();

    const swapInfo:
      | ExactInputSwapTransactionInfo
      | ExactOutputSwapTransactionInfo = {
      type: TransactionType.SWAP,
      inputCurrencyId: currencyId(trade.inputAmount.currency),
      outputCurrencyId: currencyId(trade.outputAmount.currency),
      isUniswapXOrder: false,
      ...(trade.tradeType === TradeType.EXACT_INPUT
        ? {
            tradeType: TradeType.EXACT_INPUT,
            inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            expectedOutputCurrencyAmountRaw:
              trade.outputAmount.quotient.toString(),
            minimumOutputCurrencyAmountRaw: trade
              .minimumAmountOut(allowedSlippage)
              .quotient.toString(),
          }
        : {
            tradeType: TradeType.EXACT_OUTPUT,
            maximumInputCurrencyAmountRaw: trade
              .maximumAmountIn(allowedSlippage)
              .quotient.toString(),
            outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            expectedInputCurrencyAmountRaw:
              trade.inputAmount.quotient.toString(),
          }),
    };

    addTransaction(result.response, swapInfo, result.deadline?.toNumber());


    return result;
  }, [
    account,
    addOrder,
    addTransaction,
    allowedSlippage,
    chainId,
    swapCallback,
    trade,
  ]);
}
