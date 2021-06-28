import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { AiOutlineFileMarkdown } from 'react-icons/ai'
import { Box, BoxProps } from '@chakra-ui/layout'
import { List, ListIcon, ListItem, Text } from '@chakra-ui/react'

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
    label: 'Testing Notes For Frontend Development.md',
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
      fontSize="small"
      bg="#212121"
      {...rest}
    >
      <List spacing="0.5" color="#e3e3e3" width="full" paddingY="1">
        {sidebarItems.map((item) => (
          <ListItem
            key={item.label}
            display="flex"
            alignItems="center"
            width="full"
            paddingX="0.5"
            userSelect="none"
            cursor="pointer"
            _hover={{
              bg: '#fafafa0d',
            }}
            _active={{
              bg: '#fafafa1f',
            }}
          >
            <ListIcon
              as={item.icon ? item.icon : AiOutlineFileMarkdown}
              color="#0099e0"
              fontSize="lg"
              marginRight="0.5"
            />
            <Text isTruncated>{item.label}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default React.memo(Sidebar)
