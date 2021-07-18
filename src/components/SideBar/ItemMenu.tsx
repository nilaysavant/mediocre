import React from 'react'
import { Box, BoxProps } from '@chakra-ui/layout'
import {
  Button,
  ButtonGroup,
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
import { DeleteIcon } from '@chakra-ui/icons'

export type ItemMenuProps = {
  children: (renderProps: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
  }) => JSX.Element
}

const ItemMenu = ({ children }: ItemMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="right-end"
      closeOnBlur={true}
    >
      <PopoverTrigger>{children({ isOpen, onOpen, onClose })}</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">Confirmation</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          Are you sure you want to continue with your action?
        </PopoverBody>
        <PopoverFooter d="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button variant="outline">Cancel</Button>
            <Button colorScheme="red">Apply</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
    // <Menu {...rest}>
    //   <MenuButton as={CustomMenuButton} aria-label="Document menu" />
    //   <Menu>
    //     <MenuItem icon={<DeleteIcon />} command="Del">
    //       Delete
    //     </MenuItem>
    //   </Menu>
    // </Menu>
  )
}

export default ItemMenu
