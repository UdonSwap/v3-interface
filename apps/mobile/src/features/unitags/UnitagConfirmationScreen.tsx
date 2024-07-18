import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'src/app/navigation/rootNavigation'
import { UnitagStackScreenProp } from 'src/app/navigation/types'
import { AnimateInOrder } from 'src/components/animation/AnimateInOrder'
import { Screen } from 'src/components/layout/Screen'

import {
  EmojiElement,
  ENSElement,
  FroggyElement,
  HeartElement,
  OpenseaElement,
  ReceiveUSDCElement,
  SendElement,
  SwapElement,
  TextElement,
} from 'src/features/unitags/ConfirmationElements'
import { Screens, UnitagScreens } from 'src/screens/Screens'
import { AnimatePresence, Button, Flex, Text, useDeviceDimensions, useDeviceInsets } from 'ui/src'
import { spacing } from 'ui/src/theme'
import { UNITAG_SUFFIX } from 'wallet/src/features/unitags/constants'

export function UnitagConfirmationScreen({
  route,
}: UnitagStackScreenProp<UnitagScreens.UnitagConfirmation>): JSX.Element {
  const { unitag, address, profilePictureUri } = route.params
  const dimensions = useDeviceDimensions()
  const insets = useDeviceInsets()
  

  const boxWidth = dimensions.fullWidth - insets.left - insets.right - spacing.spacing32

  const onPressCustomize = (): void => {
    navigate(Screens.UnitagStack, {
      screen: UnitagScreens.EditProfile,
      params: {
        address,
        unitag,
        entryPoint: UnitagScreens.UnitagConfirmation,
      },
    })
  }

  const onPressDone = (): void => {
    navigate(Screens.Home)
  }

  

  return (
    <Screen edges={['right', 'left', 'bottom']} pt="$spacing60">
      <Flex grow gap="$spacing16" justifyContent="space-between" pb="$spacing16" px="$spacing16">
        <Flex centered grow>
          <AnimatePresence exitBeforeEnter>
            <AnimateInOrder
              key="outerCircle"
              enterStyle={{ opacity: 0, scale: 0.5 }}
              exitStyle={{ opacity: 0, scale: 0.5 }}
              index={1}
              position="absolute">
              <Flex
                aspectRatio={1}
                borderColor="$surface3"
                borderRadius="$roundedFull"
                borderWidth={1}
                height={boxWidth}
              />
            </AnimateInOrder>
            <AnimateInOrder
              key="innerCircle"
              enterStyle={{ opacity: 0, scale: 0.5 }}
              exitStyle={{ opacity: 0, scale: 0.5 }}
              index={2}
              position="absolute">
              <Flex
                aspectRatio={1}
                borderColor="$surface3"
                borderRadius="$roundedFull"
                borderWidth={1}
                height={boxWidth * 0.6}
              />
            </AnimateInOrder>
           
            
          </AnimatePresence>
        </Flex>
       
      </Flex>
    </Screen>
  )
}

// Calculates top and left insets for absolute positioned element based
// on a 10x10 coordinate system where top left is 0,0.
const getInsetPropsForCoordinates = (
  boxWidth: number,
  x: number,
  y: number
): { top?: number; right?: number; bottom?: number; left?: number } => {
  const unitSize = 10
  const unit = boxWidth / unitSize

  let top
  let bottom
  let left
  let right

  if (x < unitSize / 2) {
    left = x * unit
  } else if (x > unitSize / 2) {
    right = (unitSize - x) * unit
  }

  if (y < unitSize / 2) {
    top = y * unit
  } else if (y > unitSize / 2) {
    bottom = (unitSize - y) * unit
  }

  return { top, right, bottom, left }
}
