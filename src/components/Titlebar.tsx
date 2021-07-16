import React from 'react'
import { Button, IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box, BoxProps } from '@chakra-ui/layout'
import { AiOutlineClose, AiOutlineFileMarkdown } from 'react-icons/ai'
import { ButtonGroup, Spacer } from '@chakra-ui/react'

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
      {...rest}
    >
      <Spacer data-tauri-drag-region />
      <ButtonGroup p="1" data-tauri-drag-region>
        <IconButton
          aria-label="close"
          icon={<AiOutlineClose />}
          fontSize="xs"
          w="1rem"
          h="1rem"
          minW="0"
          borderRadius="0"
          _focus={{
            boxShadow: 'none'
          }}
        />
      </ButtonGroup>
    </Box>
  )
}

export default React.memo(Titlebar)
