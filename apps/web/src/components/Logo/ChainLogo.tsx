import { ChainId } from "smartorderrouter18";
import { getChainInfo } from "constants/chainInfo";
import { isSupportedChain, SupportedInterfaceChain } from "constants/chains";
import { CSSProperties, FunctionComponent } from "react";
import { useTheme } from "styled-components";
import { useIsDarkMode } from "theme/components/ThemeToggle";

import { ReactComponent as arbitrum } from "./ChainSymbols/arbitrum.svg";
import { ReactComponent as avax } from "./ChainSymbols/avax.svg";
import { ReactComponent as base } from "./ChainSymbols/base.svg";
import { ReactComponent as mode } from "./ChainSymbols/mode.svg";
import { ReactComponent as bnb } from "./ChainSymbols/bnb.svg";
import { ReactComponent as ethereum } from "./ChainSymbols/ethereum.svg";
import { ReactComponent as optimism } from "./ChainSymbols/optimism.svg";
import { ReactComponent as polygon } from "./ChainSymbols/polygon.svg";

type SVG = FunctionComponent<React.SVGProps<SVGSVGElement>>;
type ChainUI = { Symbol: SVG; bgColor: string; textColor: string };

export function getChainUI(
  chainId: SupportedInterfaceChain,
  darkMode: boolean,
): ChainUI;
export function getChainUI(
  chainId: ChainId,
  darkMode: boolean,
): ChainUI | undefined {
  switch (chainId) {
    case ChainId.MODE:
      return darkMode
        ? {
            Symbol: mode,
            bgColor: "#E9E002",
            textColor: "black",
          }
        : {
            Symbol: mode,
            bgColor: "#E9E002",
            textColor: "black",
          };
    default:
      return undefined;
  }
}

export const getDefaultBorderRadius = (size: number) => size / 2 - 4;

type ChainLogoProps = {
  chainId: ChainId;
  className?: string;
  size?: number;
  borderRadius?: number;
  style?: CSSProperties;
  testId?: string;
  fillContainer?: boolean;
};
export function ChainLogo({
  chainId,
  className,
  style,
  size = 12,
  borderRadius = getDefaultBorderRadius(size),
  testId,
  fillContainer = false,
}: ChainLogoProps) {
  const darkMode = useIsDarkMode();
  const { surface2 } = useTheme();

  if (!isSupportedChain(chainId)) return null;

  const chainInfo = getChainInfo(chainId);
  if (!chainInfo) return null; // If chain info is undefined, return null
  const { label } = getChainInfo(chainId);
  const chainUI = getChainUI(chainId, darkMode);
  if (!chainUI) return null; // If chain UI is undefined, return null

  const { Symbol, bgColor } = getChainUI(chainId, darkMode);
  const iconSize = fillContainer ? "100%" : size;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      className={className}
      style={{ ...style, width: iconSize, height: iconSize }}
      aria-labelledby="titleID"
      data-testid={testId}
    >
      <title id="titleID">{`${label} logo`}</title>
      <rect
        rx={borderRadius}
        fill={surface2}
        width={iconSize}
        height={iconSize}
      />
      <rect
        rx={borderRadius}
        fill={bgColor}
        width={iconSize}
        height={iconSize}
      />
      <Symbol width={iconSize} height={iconSize} />
    </svg>
  );
}
