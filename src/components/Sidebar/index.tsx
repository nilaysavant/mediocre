import React, { useRef, useState } from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { AiFillFileMarkdown, AiOutlineFileMarkdown } from 'react-icons/ai'
import { Box, BoxProps } from '@chakra-ui/layout'
import { Input, List, ListIcon, ListItem, Text } from '@chakra-ui/react'
import BottomSection from './BottomSection'
import { useReduxDispatch, useReduxSelector } from '../../redux/hooks'
import { documentsSelectors, updateDocument } from './documentsSlice'
import TopSection from './TopSection'

export type SidebarProps = BoxProps

const Sidebar = ({ ...rest }: SidebarProps) => {
  const { colorMode } = useColorMode()
  const documents = useReduxSelector(documentsSelectors.selectAll)
  const dispatch = useReduxDispatch()
  const renameInputRef = useRef<HTMLInputElement>(null)
  const [renameItem, setRenameItem] = useState({
    id: '',
    value: '',
  })

  return (
    <Box
      display="flex"
      flexDir="column"
      rounded="none"
      minHeight="0"
      border={`1px solid ${colorMode === 'dark' ? '#404040' : '#d4d4d4'}`}
      fontSize="small"
      bg="#212121"
      _focus={{
        boxShadow: 'none',
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          /** Press Esc to cancel */
          setRenameItem({ id: '', value: '' })
        }
      }}
      {...rest}
    >
      <TopSection dirName="My Projects" />
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
            onDoubleClick={() => {
              setRenameItem({ id: item.id, value: item.name })
              setTimeout(() => {
                if (renameInputRef.current) {
                  renameInputRef.current.focus()
                  renameInputRef.current.setSelectionRange(
                    0,
                    renameInputRef.current.value.length - 3,
                    'forward'
                  )
                }
              }, 0)
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
            {renameItem.id === item.id ? (
              <Input
                size="xxs"
                _focus={{
                  boxShadow: '0px 0px 0px 1px #51a3f0c9',
                }}
                placeholder="Rename Document"
                ref={renameInputRef}
                value={renameItem.value}
                onChange={(e) =>
                  setRenameItem((old) => ({ ...old, value: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    /** Press Enter to save */
                    dispatch(
                      updateDocument({
                        id: item.id,
                        changes: {
                          name: renameItem.value,
                        },
                      })
                    )
                    setRenameItem({ id: '', value: '' })
                  } else if (e.key === 'Escape') {
                    /** Press Esc to cancel */
                    setRenameItem({ id: '', value: '' })
                  }
                }}
              />
            ) : (
              <Text isTruncated>{item.name}</Text>
            )}
          </ListItem>
        ))}
      </List>
      <BottomSection documentsCount={documents.length} />
    </Box>
  )
}

export default React.memo(Sidebar)
