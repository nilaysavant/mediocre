import React, { useState, useEffect, useMemo } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons'
import { useReduxDispatch } from '../../redux/hooks'
import { globalDocumentDelete } from './documentsSlice'
import { useRef } from 'react'
import AlertButton from './AlertButton'

export type ItemMenuProps = {
  /** ID of the Item, currently the `documentId` as used in context of the sidebar */
  itemId: string
  /** uses render props ref: https://reactjs.org/docs/render-props.html */
  children: (renderProps: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
  }) => JSX.Element
  popoverProps?: PopoverProps
}

const ItemMenu = ({ itemId, children, popoverProps }: ItemMenuProps) => {
  const dispatch = useReduxDispatch()
  const {
    isOpen: menuIsOpen,
    onOpen: menuOnOpen,
    onClose: menuOnClose,
  } = useDisclosure()
  const {
    isOpen: alertIsOpen,
    onOpen: alertOnOpen,
    onClose: alertOnClose,
  } = useDisclosure()
  const [focusedIdx, setFocusedIdx] = useState(0)
  const alertCancelBtnRef = useRef<HTMLButtonElement>(null)
  /** menu item definitions */
  const menuItems = useMemo<
    {
      id: string
      icon: any
      label: string
      command?: string
      onClick?: () => void
    }[]
  >(
    () => [
      {
        id: 'rename',
        icon: CopyIcon,
        label: 'Rename',
        command: 'F2',
        onClick: () => console.log('rename clicked'),
      },
      {
        id: 'copy',
        icon: CopyIcon,
        label: 'Copy',
        command: 'Ctrl+C',
        onClick: () => console.log('copy clicked'),
      },
      {
        id: 'duplicate',
        icon: CopyIcon,
        label: 'Duplicate',
        command: 'Ctrl+D',
        onClick: () => console.log('duplicate clicked'),
      },
      {
        id: 'delete',
        icon: DeleteIcon,
        label: 'Delete',
        command: 'Del',
        onClick: () => alertOnOpen(),
      },
    ],
    [alertOnOpen]
  )
  const itemRefs = menuItems.map((_item) => React.createRef<HTMLLIElement>())

  useEffect(() => {
    /** reset focused idx to 0 on Open */
    if (menuIsOpen) setFocusedIdx(0)
  }, [menuIsOpen])

  useEffect(() => {
    const ref = itemRefs[focusedIdx].current
    if (ref) ref.focus()
  }, [focusedIdx, itemRefs])

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={menuIsOpen}
      onClose={menuOnClose}
      placement="right-start"
      closeOnBlur={true}
      offset={[0, -5]}
      initialFocusRef={itemRefs[focusedIdx]}
      {...popoverProps}
    >
      <PopoverTrigger>
        {children({
          isOpen: menuIsOpen,
          onOpen: menuOnOpen,
          onClose: menuOnClose,
        })}
      </PopoverTrigger>
      <PopoverContent
        w="full"
        borderRadius="none"
        _focus={{
          boxShadow: 'none',
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            setFocusedIdx((old) => (old >= menuItems.length - 1 ? 0 : old + 1))
          } else if (e.key === 'ArrowUp') {
            setFocusedIdx((old) => (old <= 0 ? menuItems.length - 1 : old - 1))
          }
        }}
      >
        <PopoverBody p="0" minWidth="44" maxWidth="72" boxShadow="dark-lg">
          <List
            borderRadius="none"
            fontSize="small"
            flex="1"
            minHeight="0"
            spacing="0"
            w="full"
            py="0.5"
          >
            {menuItems.map((item, idx) => (
              <ListItem
                key={item.id}
                ref={itemRefs[idx]}
                tabIndex={0}
                display="flex"
                alignItems="center"
                py="1"
                px="5"
                userSelect="none"
                cursor="default"
                w="full"
                _hover={{
                  bg: '#fafafa0d',
                }}
                _focus={{
                  bg: '#fafafa0d',
                }}
                _active={{
                  bg: '#fafafa1f',
                }}
                onClick={() => {
                  if (item.onClick) item.onClick()
                  menuOnClose()
                }}
                onMouseOver={() => {
                  const ref = itemRefs[idx].current
                  if (ref) ref.focus()
                }}
              >
                <ListIcon
                  as={item.icon}
                  color="icon.dark.400"
                  fontSize="sm"
                  marginRight="1.5"
                />
                <Text isTruncated>{item.label}</Text>
                <Spacer />
                {item.command ? (
                  <Text color="#ffffff87">{item.command}</Text>
                ) : null}
              </ListItem>
            ))}
          </List>
          <AlertDialog
            isOpen={alertIsOpen}
            leastDestructiveRef={alertCancelBtnRef}
            onClose={alertOnClose}
            size="sm"
          >
            {/* <AlertDialogOverlay> */}
            <AlertDialogContent
              borderRadius="0"
              marginTop="15%"
              px="0.5"
              py="2.5"
            >
              <AlertDialogHeader py="1.5" fontSize="md" fontWeight="normal">
                Delete Document
              </AlertDialogHeader>
              <AlertDialogBody py="1" fontSize="sm">
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
              <AlertDialogFooter py="2">
                <ButtonGroup>
                  <AlertButton
                    buttonRef={alertCancelBtnRef}
                    onClick={alertOnClose}
                  >
                    Cancel
                  </AlertButton>
                  <AlertButton
                    bg="rgb(161, 55, 55)"
                    _hover={{
                      bg: 'rgb(161, 72, 72)',
                    }}
                    _active={{
                      bg: 'rgb(161, 91, 91)',
                    }}
                    onClick={() => {
                      // dispatch(globalDocumentDelete({ documentId: itemId }))
                      alertOnClose()
                    }}
                  >
                    Delete
                  </AlertButton>
                </ButtonGroup>
              </AlertDialogFooter>
            </AlertDialogContent>
            {/* </AlertDialogOverlay> */}
          </AlertDialog>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ItemMenu
