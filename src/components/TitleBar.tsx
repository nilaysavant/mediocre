import React from 'react'
import { IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { Box, BoxProps } from '@chakra-ui/layout'
import { AiOutlineClose } from 'react-icons/ai'
import { FiMaximize, FiMinimize2 } from 'react-icons/fi'
import { ButtonGroup, Icon, Spacer, Text } from '@chakra-ui/react'
import { appWindow } from '@tauri-apps/api/window'
import AppLogoIcon from '../icons/AppLogoIcon'

export type TitleBarProps = BoxProps

const TitleBar = ({ ...rest }: TitleBarProps) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      /** enable tauri drag window */
      data-tauri-drag-region
      display="flex"
      justifyContent="center"
      width="full"
      alignItems="center"
      bg="bg.dark.600"
      position="relative"
      {...rest}
    >
      <Box
        data-tauri-drag-region
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        display="flex"
        alignItems="center"
        px="5"
      >
        <Icon isTauriDragRegion as={AppLogoIcon} fontSize="1.9rem" mr="1" />
        <Text
          data-tauri-drag-region
          userSelect="none"
          cursor="default"
          fontSize="sm"
        >
          Mediocre Editor
        </Text>
      </Box>
      <Spacer data-tauri-drag-region />
      <ButtonGroup data-tauri-drag-region p="1.5" spacing="1.5">
        <IconButton
          aria-label="app-window-minimize"
          icon={<FiMinimize2 />}
          fontSize="xs"
          w="1rem"
          h="1rem"
          minW="0"
          borderRadius="0"
          _focus={{
            boxShadow: 'none',
          }}
          onClick={async () => await appWindow.minimize()}
        />
        <IconButton
          aria-label="app-window-maximize"
          icon={<FiMaximize />}
          fontSize="xs"
          w="1rem"
          h="1rem"
          minW="0"
          borderRadius="0"
          _focus={{
            boxShadow: 'none',
          }}
          onClick={async () => {
            if (await appWindow.isMaximized()) await appWindow.unmaximize()
            else await appWindow.maximize()
          }}
        />
        <IconButton
          aria-label="app-window-close"
          icon={<AiOutlineClose />}
          fontSize="xs"
          w="1rem"
          h="1rem"
          minW="0"
          borderRadius="0"
          _focus={{
            boxShadow: 'none',
          }}
          onClick={async () => await appWindow.close()}
        />
      </ButtonGroup>
    </Box>
  )
}

export default React.memo(TitleBar)
