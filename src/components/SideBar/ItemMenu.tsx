import React, { useState, useEffect } from 'react'
import {
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

const menuItems: {
  id: string
  icon: any
  label: string
  command?: string
  onClick?: () => void
}[] = [
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
    onClick: () => console.log('delete clicked'),
  },
]

export type ItemMenuProps = {
  /** uses render props ref: https://reactjs.org/docs/render-props.html */
  children: (renderProps: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
  }) => JSX.Element
  popoverProps?: PopoverProps
}

const ItemMenu = ({ children, popoverProps }: ItemMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [focusedIdx, setFocusedIdx] = useState(0)
  const itemRefs = menuItems.map((_item) => React.createRef<HTMLLIElement>())

  useEffect(() => {
    const ref = itemRefs[focusedIdx].current
    if (ref) ref.focus()
  }, [focusedIdx, itemRefs])

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="right-start"
      closeOnBlur={true}
      offset={[0, -5]}
      initialFocusRef={itemRefs[focusedIdx]}
      {...popoverProps}
    >
      <PopoverTrigger>{children({ isOpen, onOpen, onClose })}</PopoverTrigger>
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
                  onClose()
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
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ItemMenu
