import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { AiFillFileMarkdown, AiOutlineFileMarkdown } from 'react-icons/ai'
import { BsPlus } from 'react-icons/bs'
import { Box, BoxProps } from '@chakra-ui/layout'
import {
  Icon,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Text,
} from '@chakra-ui/react'
import BottomSection from './BottomSection'
import { IconType } from 'react-icons/lib'
import { useReduxSelector } from '../../redux/hooks'
import { documentsSelectors } from './documentsSlice'

// const sidebarItems: {
//   filePath: string
//   fileName: string
//   icon?: IconType
// }[] = [
//   {
//     filePath: '/my-projects/Docs.md',
//     fileName: 'Docs.md',
//     icon: AiOutlineFileMarkdown,
//   },
//   {
//     filePath: '/my-projects/README.md',
//     fileName: 'README.md',
//     icon: AiOutlineFileMarkdown,
//   },
//   {
//     filePath: '/my-projects/Testing Notes For Frontend Development.md',
//     fileName: 'Testing Notes For Frontend Development.md',
//   },
//   {
//     filePath: '/my-projects/Authors.md',
//     fileName: 'Authors.md',
//     icon: AiOutlineFileMarkdown,
//   },
// ]

export type SidebarProps = BoxProps

const Sidebar = ({ ...rest }: SidebarProps) => {
  const { colorMode } = useColorMode()
  const documents = useReduxSelector(documentsSelectors.selectAll)

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
      <Box
        bg="#ffffff0d"
        px="1"
        py="0.18rem"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid #ffffff12"
        color="#ebebebeb"
        fontSize="xs"
        width="full"
      >
        <Text isTruncated>My Projects</Text>
        <IconButton
          aria-label="Add new document"
          icon={<Icon as={BsPlus} />}
          color="#ebebebeb"
          minWidth="4"
          height="4"
          borderRadius="0"
          _focus={{
            boxShadow: '0px 0px 0px 1px #51a3f0b3',
          }}
        />
      </Box>
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
        {documents.map((item, idx) => (
          <ListItem
            key={item.id}
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
              as={
                item.type === 'markdown'
                  ? AiOutlineFileMarkdown
                  : AiFillFileMarkdown
              }
              color="#0099e0"
              fontSize="lg"
              marginRight="0"
            />
            <Text isTruncated>{item.name}</Text>
          </ListItem>
        ))}
      </List>
      <BottomSection documentsCount={documents.length} />
    </Box>
  )
}

export default React.memo(Sidebar)
