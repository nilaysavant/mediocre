import React, { useContext } from 'react'
import { Button, IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { ChevronDownIcon, Icon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import mdThemes, { MdThemeContext, MdThemeTypes } from '../styles/markdown'

function Topbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { theme: mdTheme, setMdTheme } = useContext(MdThemeContext)

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box>
        <Menu gutter={1}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
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
      </Box>
      <Box display="flex" alignItems="center">
        <Menu gutter={1}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            borderRadius="sm"
            marginX="0.5"
            _focus={{
              outline: 'none',
              borderBottom: '4px solid #616161',
            }}
            value={mdTheme}
            onSelect={(e) => console.log(e)}
          >
            {mdTheme}
          </MenuButton>
          <MenuList borderRadius="sm" fontSize="md">
            {mdThemes.map((theme) => (
              <MenuItem
                display="flex"
                justifyContent="space-between"
                value={theme}
                onClick={(e) =>
                  mdThemes.includes(e.currentTarget.value) &&
                  setMdTheme(e.currentTarget.value as MdThemeTypes)
                }
              >
                {theme}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <IconButton
          size="sm"
          borderRadius="sm"
          marginLeft="0.5"
          _focus={{
            outline: 'none',
            borderBottom: '4px solid #616161',
          }}
          aria-label="Toggle theme"
          onClick={toggleColorMode}
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        />
      </Box>
    </Box>
  )
}

export default React.memo(Topbar)
