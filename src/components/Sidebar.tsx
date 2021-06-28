import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { AiOutlineFileMarkdown } from 'react-icons/ai'
import { Box, BoxProps } from '@chakra-ui/layout'
import { List, ListIcon, ListItem } from '@chakra-ui/react'

const sidebarItems = [
  {
    label: 'Docs.md',
    icon: AiOutlineFileMarkdown,
  },
  {
    label: 'README.md',
    icon: AiOutlineFileMarkdown,
  },
  {
    label: 'Testing Notes.md',
  },
  {
    label: 'Authors.md',
    icon: AiOutlineFileMarkdown,
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
      fontSize="xs"
      bg="#212121"
      {...rest}
    >
      <List spacing="0.5" padding="2" color="#e3e3e3">
        {sidebarItems.map((item) => (
          <ListItem key={item.label} display="flex" alignItems="center">
            <ListIcon
              as={item.icon ? item.icon : AiOutlineFileMarkdown}
              color="blue.300"
              fontSize="lg"
              marginRight="1"
            />
            {item.label}
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default React.memo(Sidebar)
