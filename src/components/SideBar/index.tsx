import React, { useRef, useState, useEffect } from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { AiFillFileMarkdown, AiOutlineFileMarkdown } from 'react-icons/ai'
import { Box, BoxProps } from '@chakra-ui/layout'
import { Circle, Input, List, ListIcon, ListItem, Text } from '@chakra-ui/react'
import BottomSection from './BottomSection'
import { useReduxDispatch, useReduxSelector } from '../../redux/hooks'
import {
  globalDocumentOpen,
  globalAllDocumentsListFetch,
  documentsSelectors,
  documentUpdate,
  documentAdd,
  globalDocumentAdd,
} from './documentsSlice'
import TopSection from './TopSection'
import { getUniqueIdV4 } from '../../utils/idGenerator'
import dayjs from 'dayjs'
import AddDocItem from './AddDocItem'

export type SideBarProps = BoxProps

const SideBar = ({ ...rest }: SideBarProps) => {
  const { colorMode } = useColorMode()
  const dispatch = useReduxDispatch()
  const documents = useReduxSelector(documentsSelectors.selectAll)
  const isAllDocumentsFetching = useReduxSelector(
    (state) => state.documents.isAllDocumentsFetching
  )
  const selectedDocument = useReduxSelector(
    (state) => state.documents.selectedDocument
  )
  const [addItemInputActive, setAddItemInputActive] = useState(false)
  const renameInputRef = useRef<HTMLInputElement>(null)
  const addInputRef = useRef<HTMLInputElement>(null)
  const [renameItem, setRenameItem] = useState({
    id: '',
    value: '',
  })

  useEffect(() => {
    const gdlfPromise = dispatch(globalAllDocumentsListFetch())
    return () => {
      gdlfPromise.abort('Sidebar unmounted')
    }
  }, [dispatch])

  return (
    <Box
      display="flex"
      flexDir="column"
      rounded="none"
      minHeight="0"
      borderTop="none"
      fontSize="small"
      bg="bg.dark.400"
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
      <TopSection
        dirName="My Projects"
        isLoading={isAllDocumentsFetching}
        onAddClick={() => {
          setAddItemInputActive(true)
          setTimeout(() => {
            if (addInputRef?.current) {
              addInputRef.current.focus()
              addInputRef.current.setSelectionRange(
                0,
                addInputRef.current.value.length - 3,
                'forward'
              )
            }
          }, 0)
        }}
      />
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
        {addItemInputActive ? (
          <AddDocItem
            paddingTop="0.5"
            _hover={{
              bg: '#fafafa0d',
            }}
            _active={{
              bg: '#fafafa1f',
            }}
            inputRef={addInputRef}
            onAdd={(fileName) => {
              // dispatch(
              //   documentAdd({
              //     id: getUniqueIdV4(),
              //     name: fileName,
              //     type: 'markdown',
              //     content: '',
              //     dir: '',
              //     path: '',
              //     relativePath: fileName,
              //     modified: new Date().toISOString(),
              //     synced: false,
              //     saved: true,
              //   })
              // )
              dispatch(globalDocumentAdd({ documentFileName: fileName }))
              setAddItemInputActive(false)
            }}
            onCancel={() => setAddItemInputActive(false)}
          />
        ) : null}
        {documents
          .sort((prev, next) => {
            const prevMod = dayjs(prev.modified).unix()
            const nextMod = dayjs(next.modified).unix()
            /** descending order of modified date, ie. latest modified is first */
            return nextMod - prevMod
          })
          .map((doc, idx) => (
            <ListItem
              key={doc.id}
              display="flex"
              alignItems="center"
              width="full"
              paddingX="0.5"
              paddingTop={idx === 0 ? 0.5 : undefined}
              userSelect="none"
              cursor="pointer"
              bg={doc.id === selectedDocument ? '#adadad21' : undefined}
              _hover={{
                bg: '#fafafa0d',
              }}
              _active={{
                bg: '#fafafa1f',
              }}
              onDoubleClick={() => {
                setRenameItem({ id: doc.id, value: doc.name })
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
              onClick={() =>
                dispatch(globalDocumentOpen({ documentId: doc.id }))
              }
            >
              <ListIcon
                as={
                  doc.type === 'markdown'
                    ? AiOutlineFileMarkdown
                    : AiFillFileMarkdown
                }
                color="icon.dark"
                fontSize="xl"
                marginRight="0.5"
              />
              {renameItem.id === doc.id ? (
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
                        documentUpdate({
                          id: doc.id,
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
                <Box
                  flex="1"
                  minW="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pr="0.5"
                >
                  <Text isTruncated>{doc.name}</Text>
                  {!doc.saved ? (
                    <Circle size="0.5rem" bg="whiteAlpha.400" />
                  ) : null}
                </Box>
              )}
            </ListItem>
          ))}
      </List>
      <BottomSection documentsCount={documents.length} />
    </Box>
  )
}

export default React.memo(SideBar)
