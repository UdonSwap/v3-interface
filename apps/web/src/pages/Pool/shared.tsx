import { ButtonGray } from "components/Button";
import { Pool } from "components/Icons/Pool";
import { FlyoutAlignment, Menu } from "components/Menu";
import { Trans, t } from "i18n";
import { ChevronDown } from "react-feather";
import { useModalIsOpen } from "state/application/hooks";
import { ApplicationModal } from "state/application/reducer";
import styled, { css } from "styled-components";
import { ThemedText } from "theme/components";
import { ProtocolVersion } from "uniswap/src/data/graphql/uniswap-data-api/__generated__/types-and-hooks";

const PoolVersionItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
`;

const PoolOptionsButton = styled(ButtonGray)<{ $isOpen: boolean }>`
  flex: 1 1 auto;
  padding: 6px 8px 6px 12px;
  width: 100%;
  background-color: #1c1924 !important;
  border: none;
  border-radius: 8px;
  gap: 6px;

  &:hover {
    opacity: 0.9;
  }

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      background-color: ${({ theme }) => theme.surface1};
    `}
`;

const StyledChevron = styled(ChevronDown)<{ $isOpen: boolean }>`
  color: white;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: ${({
    theme: {
      transition: { duration, timing },
    },
  }) => `transform ${duration.fast} ${timing.ease}`};
`;

const menuItems = {
  [ProtocolVersion.V3]: {
    content: (
      <PoolVersionItem>
        <Pool width="20px" height="20px" />
        <ThemedText.BodyPrimary lineHeight="24px" color="currentColor">
          <Trans>v3 pools</Trans>
        </ThemedText.BodyPrimary>
      </PoolVersionItem>
    ),
    link: "/pool",
    external: false,
  },
  [ProtocolVersion.V2]: {
    content: (
      <PoolVersionItem>
        <Pool width="20px" height="20px" />
        <ThemedText.BodyPrimary lineHeight="24px" color="currentColor">
          <Trans>v2 pools</Trans>
        </ThemedText.BodyPrimary>
      </PoolVersionItem>
    ),
    link: "/pools/v2",
    external: false,
  },
};

const titles = {
  [ProtocolVersion.V3]: t`v3`,
  [ProtocolVersion.V2]: t`v2`,
};

export function PoolVersionMenu({
  protocolVersion,
}: {
  protocolVersion: ProtocolVersion;
}) {
  const isOpen = useModalIsOpen(ApplicationModal.POOL_VERSION);

  return (
    <Menu
      modal={ApplicationModal.POOL_VERSION}
      menuItems={[
        menuItems[
          protocolVersion === ProtocolVersion.V3
            ? ProtocolVersion.V2
            : ProtocolVersion.V3
        ],
      ]}
      flyoutAlignment={FlyoutAlignment.LEFT}
      ToggleUI={(props: any) => (
        <PoolOptionsButton {...props} $isOpen={isOpen}>
          <ThemedText.BodyPrimary>
            {titles[protocolVersion]}
          </ThemedText.BodyPrimary>
          <StyledChevron $isOpen={isOpen} />
        </PoolOptionsButton>
      )}
    />
  );
}
