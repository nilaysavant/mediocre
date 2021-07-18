import React from 'react'
import { Box, BoxProps } from '@chakra-ui/layout'
import {
  Button,
  ButtonGroup,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons'
import { IconType } from 'react-icons/lib'
import { useRef } from 'react'

const menuItems: {
  id: string
  icon: any
  label: string
  command?: string
  onClick?: () => void
}[] = [
  {
    id: 'duplicate',
    icon: CopyIcon,
    label: 'Duplicate',
    command: 'Ctrl+D',
    onClick: () => console.log('open clicked'),
  },
  {
    id: 'delete',
    icon: DeleteIcon,
    label: 'Delete',
    command: 'Del',
    onClick: () => console.log('del clicked'),
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
  const focusRef = useRef<HTMLLIElement>(null)

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="right-start"
      closeOnBlur={true}
      offset={[0, -5]}
      initialFocusRef={focusRef}
      {...popoverProps}
    >
      <PopoverTrigger>{children({ isOpen, onOpen, onClose })}</PopoverTrigger>
      <PopoverContent
        w="full"
        borderRadius="none"
        _focus={{
          boxShadow: 'none',
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
                ref={idx === 0 ? focusRef : undefined}
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
              >
                <ListIcon
                  as={item.icon}
                  color="icon.dark.400"
                  fontSize="sm"
                  marginRight="1.5"
                />
                <Text isTruncated>{item.label}</Text>
                <Spacer />
                {item.command ? <Text color="#ffffff87">{item.command}</Text> : null}
              </ListItem>
            ))}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ItemMenu
