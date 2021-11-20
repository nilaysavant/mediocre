import React from 'react'
import { Button, IconButton } from '@chakra-ui/button'
import { useColorMode } from '@chakra-ui/color-mode'
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box, BoxProps } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import {
  mdThemes,
  MdThemeTypes,
  updateTheme,
} from '../styles/markdown/markdownThemeSlice'
import { Link, useLocation } from 'react-router-dom'
import { globalDocumentSave } from '../features/documents/documentsSlice'
import { appWindow } from '@tauri-apps/api/window'

export type TopBarProps = BoxProps

const TopBar = ({ ...rest }: TopBarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const routerLocation = useLocation()
  const mdTheme = useReduxSelector((state) => state.markdownTheme.theme)
  const dispatch = useReduxDispatch()

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      bg="bg.dark.500"
      {...rest}
    >
      <Box display="flex" alignItems="center">
        <Menu gutter={0}>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="xs"
            borderRadius="none"
            _focus={{
              outline: 'none',
              borderBottom: '1px solid #616161',
            }}
            fontWeight="hairline"
          >
            File
          </MenuButton>
          <MenuList borderRadius="none" fontSize="xs" minWidth="36">
            {/* <MenuItem
              display="flex"
              justifyContent="space-between"
              command="Ctrl+N"
            >
              New
            </MenuItem> */}
            {routerLocation.pathname === '/app/md-editor' ? (
              <MenuItem
                display="flex"
                justifyContent="space-between"
                command="Ctrl+S"
                onClick={() => dispatch(globalDocumentSave())}
              >
                Save
              </MenuItem>
            ) : null}
            {/* <MenuItem>Duplicate</MenuItem> */}
            <Link to="/app/settings">
              <MenuItem>Settings</MenuItem>
            </Link>
            <Link to="/app">
              <MenuItem>Startup</MenuItem>
            </Link>
            <MenuItem onClick={async () => await appWindow.close()}>
              Quit
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      <Box display="flex" alignItems="center">
        <Menu gutter={0}>
          {routerLocation.pathname === '/app/md-editor' ? (
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="xs"
              borderRadius="none"
              _focus={{
                outline: 'none',
                borderBottom: '1px solid #616161',
              }}
              fontWeight="hairline"
              value={mdTheme}
              onSelect={(e) => console.log(e)}
            >
              {mdThemes.byId[mdTheme].label}
            </MenuButton>
          ) : null}
          <MenuList borderRadius="none" fontSize="xs" minWidth="36">
            {mdThemes.list.map((theme) => (
              <MenuItem
                key={`mdThemeMenuItem-${theme}`}
                display="flex"
                justifyContent="space-between"
                value={theme}
                onClick={(e) =>
                  mdThemes.list.includes(
                    e.currentTarget.value as MdThemeTypes
                  ) &&
                  dispatch(updateTheme(e.currentTarget.value as MdThemeTypes))
                }
              >
                {mdThemes.byId[theme].label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        {/* <IconButton
          size="xs"
          borderRadius="none"
          _focus={{
            outline: 'none',
            borderBottom: '1px solid #616161',
          }}
          fontWeight="hairline"
          aria-label="Toggle theme"
          onClick={toggleColorMode}
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        /> */}
      </Box>
    </Box>
  )
}

export default React.memo(TopBar)
