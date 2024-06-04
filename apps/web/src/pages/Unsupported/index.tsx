import React from "react";
import "./unsupported.css";
import network from "../../assets/images/network.gif";
import { ChainId } from "udonswap-core";
import { useWeb3React } from "@web3-react/core";
import { showTestnetsAtom } from "components/AccountDrawer/TestnetsToggle";
import { ChainLogo } from "components/Logo/ChainLogo";
import { getConnection } from "connection";
import { ConnectionType } from "connection/types";
import { WalletConnectV2 } from "connection/WalletConnectV2";
import { getChainInfo } from "constants/chainInfo";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  getChainPriority,
  L1_CHAIN_IDS,
  L2_CHAIN_IDS,
  TESTNET_CHAIN_IDS,
} from "constants/chains";
import useSelectChain from "hooks/useSelectChain";
import useSyncChainQuery from "hooks/useSyncChainQuery";
import { t } from "i18n";
import { useAtomValue } from "jotai/utils";
import { useCallback, useMemo, useState } from "react";
import { AlertTriangle } from "react-feather";
import { css, useTheme } from "styled-components";
import { getSupportedChainIdsFromWalletConnectSession } from "utils/getSupportedChainIdsFromWalletConnectSession";

import {
  DropdownSelector,
  StyledMenuContent,
} from "components/DropdownSelector";

export default function Unsupported() {
  const selectChain = useSelectChain();
  useSyncChainQuery();

  const [pendingChainId, setPendingChainId] = useState<ChainId | undefined>(
    undefined,
  );
  const onSelectChain = useCallback(
    async (targetChainId: ChainId) => {
      setPendingChainId(targetChainId);
      await selectChain(targetChainId);
      setPendingChainId(undefined);
      
    },
    [selectChain],
  );
  return (
    <div className="container">
      <div className="flexContainer">
        <div className="netIcon">
          <img src={network}></img>
        </div>
        <div className="flexInfo">
          <div className="info1">
            Your wallet is connected to unsupported chain
          </div>
          <div className="info2">Click button below to change chain</div>
        </div>
        <button className="switch">Switch to Mode</button>
      </div>
    </div>
  );
}
