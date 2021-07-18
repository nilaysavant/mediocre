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
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons'
import { IconType } from 'react-icons/lib'

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
    command: '',
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

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="right-start"
      closeOnBlur={true}
      offset={[0, 0]}
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
        <PopoverBody p="0" minWidth="36" maxWidth="72">
          <List
            borderRadius="none"
            fontSize="xs"
            flex="1"
            minHeight="0"
            spacing="0.5"
            color="#e3e3e3"
            w="full"
          >
            {menuItems.map((item) => (
              <ListItem
                key={item.id}
                display="flex"
                alignItems="center"
                py="0.5"
                px="2"
                userSelect="none"
                cursor="pointer"
                w="full"
                _hover={{
                  bg: '#fafafa0d',
                }}
                _active={{
                  bg: '#fafafa1f',
                }}
                onClick={item.onClick}
              >
                <ListIcon
                  as={item.icon}
                  color="icon.dark"
                  fontSize="small"
                  marginRight="1.5"
                />
                <Text isTruncated>{item.label}</Text>
              </ListItem>
            ))}
          </List>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default ItemMenu
