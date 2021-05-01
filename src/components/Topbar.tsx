import React from 'react'
import { Button, IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { ChevronDownIcon, Icon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { IoIosSave } from 'react-icons/io'

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
              borderBottom: '4px solid #616161',
            }}
          >
            File
          </MenuButton>
          <MenuList borderRadius="sm" fontSize="md">
            <MenuItem display="flex" justifyContent="space-between">
              <Box>New</Box>
              <Box
                color="gray.700"
                fontSize="sm"
                background="gray.300"
                rounded="sm"
                paddingX="2"
              >
                Ctrl+N
              </Box>
            </MenuItem>
            <MenuItem display="flex" justifyContent="space-between">
              <Box>Save</Box>
              <Box
                color="gray.700"
                fontSize="sm"
                background="gray.300"
                rounded="sm"
                paddingX="2"
              >
                Ctrl+S
              </Box>
            </MenuItem>
            <MenuItem>Duplicate</MenuItem>
            <MenuItem>Quit</MenuItem>
          </MenuList>
        </Menu>
      </div>
      <IconButton
        size="sm"
        borderRadius="sm"
        _focus={{
          outline: 'none',
          borderBottom: '4px solid #616161',
        }}
        aria-label="Toggle theme"
        onClick={toggleColorMode}
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
      />
    </Box>
  )
}

export default React.memo(Topbar)
