import { Button, IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import React from 'react'

function Topbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <div className="flex w-full">
        <Button size="sm" marginBottom="1" borderRadius="sm">
          File
        </Button>
      </div>
      <IconButton
        size="sm"
        borderRadius="sm"
        _focus={{
          outline: 'none',
        }}
        aria-label="Toggle theme"
        onClick={toggleColorMode}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      />
    </Box>
  )
}

export default React.memo(Topbar)
