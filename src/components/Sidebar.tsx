import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { GoMarkdown } from 'react-icons/go'
import { Box, BoxProps } from '@chakra-ui/layout'
import { List, ListIcon, ListItem } from '@chakra-ui/react'

const sidebarItems = [
  {
    label: 'Docs.md',
    icon: GoMarkdown,
  },
  {
    label: 'README.md',
    icon: GoMarkdown,
  },
  {
    label: 'Testing Notes.md',
  },
  {
    label: 'Authors.md',
    icon: GoMarkdown,
  },
]

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
      bg="#212121"
      {...rest}
    >
      <List spacing="0.1" padding="2" color="#e3e3e3">
        {sidebarItems.map((item) => (
          <ListItem key={item.label} display="flex" alignItems="center">
            {item.icon ? (
              <ListIcon as={item.icon} color="blue.300" fontSize="xl" />
            ) : (
              <ListIcon as={GoMarkdown} color="blue.300" fontSize="xl" />
            )}
            {item.label}
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default React.memo(Sidebar)
