import { Button, IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import React from 'react'

function Topbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <div className="flex w-full">
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            marginBottom="1"
            borderRadius="sm"
            _focus={{
              outline: 'none',
              borderBottom: '4px solid #616161'
            }}
          >
            File
          </MenuButton>
          <MenuList borderRadius="sm">
            <MenuItem>Download</MenuItem>
            <MenuItem>Create a Copy</MenuItem>
            <MenuItem>Mark as Draft</MenuItem>
            <MenuItem>Delete</MenuItem>
            <MenuItem>Attend a Workshop</MenuItem>
          </MenuList>
        </Menu>
      </div>
      <IconButton
        size="sm"
        borderRadius="sm"
        _focus={{
          outline: 'none',
          borderBottom: '4px solid #616161'
        }}
        aria-label="Toggle theme"
        onClick={toggleColorMode}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      />
    </Box>
  )
}

export default React.memo(Topbar)
