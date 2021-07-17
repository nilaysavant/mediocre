import React from 'react'
import { IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { Box, BoxProps } from '@chakra-ui/layout'
import { AiOutlineClose } from 'react-icons/ai'
import { FiMaximize, FiMinimize2 } from 'react-icons/fi'
import { ButtonGroup, Spacer } from '@chakra-ui/react'
import { appWindow } from '@tauri-apps/api/window'

export type TitlebarProps = BoxProps

const Titlebar = ({ ...rest }: TitlebarProps) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      /** enable tauri drag window */
      data-tauri-drag-region
      display="flex"
      justifyContent="space-between"
      width="full"
      alignItems="center"
      bg="bg.dark.600"
      {...rest}
    >
      <Spacer data-tauri-drag-region />
      <ButtonGroup data-tauri-drag-region p="1" spacing="1">
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

export default React.memo(Titlebar)
