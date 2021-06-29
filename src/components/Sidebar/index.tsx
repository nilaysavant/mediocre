import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { AiOutlineFileMarkdown } from 'react-icons/ai'
import { Box, BoxProps } from '@chakra-ui/layout'
import { List, ListIcon, ListItem, Text } from '@chakra-ui/react'
import BottomSection from './BottomSection'

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
      flexDir="column"
      rounded="none"
      minHeight="0"
      border={`1px solid ${colorMode === 'dark' ? '#404040' : '#d4d4d4'}`}
      fontSize="small"
      bg="#212121"
      {...rest}
    >
      <Text
        bg="#ffffff0d"
        px="1"
        py="0.18rem"
        display="flex"
        alignItems="center"
        borderBottom="1px solid #ffffff12"
        isTruncated
        color="#ebebebeb"
        fontSize="xs"
      >
        My Projects
      </Text>
      <List
        flex="1"
        minHeight="0"
        spacing="0.5"
        color="#e3e3e3"
        width="full"
        overflow="auto"
        css={{
          /** Style Scrollbar */
          '&::-webkit-scrollbar': {
            background: 'rgba(89, 89, 89, 0.1)',
            height: '1rem',
            width: 5,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(90, 90, 90, 0.1)',
            height: '1rem',
          },
          '&:hover::-webkit-scrollbar-thumb': {
            background: 'rgba(90, 90, 90, 0.438)',
          },
          '&:hover::-webkit-scrollbar-thumb:active': {
            background: ' rgba(90, 90, 90, 0.712)',
          },
        }}
      >
        {sidebarItems.map((item, idx) => (
          <ListItem
            key={item.label}
            display="flex"
            alignItems="center"
            width="full"
            paddingX="0.5"
            paddingTop={idx === 0 ? 1 : undefined}
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
              marginRight="0"
            />
            <Text isTruncated>{item.label}</Text>
          </ListItem>
        ))}
      </List>
      <BottomSection documentsCount={sidebarItems.length} />
    </Box>
  )
}

export default React.memo(Sidebar)
