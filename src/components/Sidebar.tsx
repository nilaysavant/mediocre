import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Box, BoxProps } from '@chakra-ui/layout'
import { List, ListIcon, ListItem } from '@chakra-ui/react'

export type SidebarProps = BoxProps

const Sidebar = ({ ...rest }: SidebarProps) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      display="flex"
      rounded="none"
      minHeight="0"
      border={`1px solid ${colorMode === 'dark' ? '#404040' : '#d4d4d4'}`}
      fontSize="small"
      // minWidth="2"
      // minWidth="15%"
      {...rest}
    >
      <List spacing="0.1">
        <ListItem>
          <ListIcon as={MoonIcon} color="green.500" />
          Docs.md
        </ListItem>
        <ListItem>README.md</ListItem>
        <ListItem>Testing Notes.md</ListItem>
        <ListItem>Authors.md</ListItem>
      </List>
    </Box>
  )
}

export default React.memo(Sidebar)
