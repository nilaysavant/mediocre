import React, { useState } from 'react'
import { Box, List, ListIcon, ListItem, UnorderedList } from '@chakra-ui/layout'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/modal'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input'
import {
  AddIcon,
  ExternalLinkIcon,
  QuestionIcon,
  SearchIcon,
  SettingsIcon,
} from '@chakra-ui/icons'
import { Button } from '@chakra-ui/button'
import { AiOutlineEnter } from 'react-icons/ai'
import { IconType } from 'react-icons/lib'

const commandItems = [0, 1, 2, 3, 4]

export type CommandItemProps = {
  id: string
  title: string
  subtitle: string
  icon: IconType
  focused?: boolean
  selected?: boolean
}

function CommandItem({
  id,
  title,
  subtitle,
  icon,
  focused = false,
  selected = false,
}: CommandItemProps) {
  return (
    <ListItem
      id={id}
      display="flex"
      alignItems="center"
      _focus={{
        background: '#0072a3',
      }}
      paddingX="2"
      paddingY="2"
      borderRadius="md"
      userSelect="none"
      cursor="pointer"
      background={focused ? '#0072a3' : selected ? '#1A202C' : '#242933'}
    >
      <ListIcon as={AddIcon} color="green.500" fontSize="lg" />
      <Box flex="1" paddingX="0.5">
        <Box fontSize="smaller" color="gray.400">
          {title}
        </Box>
        <Box fontSize="medium" color="gray.100" lineHeight="shorter">
          {subtitle}
        </Box>
      </Box>
      <ListIcon as={icon} color="blue.400" />
    </ListItem>
  )
}

export type CommandModalProps = {
  isOpen: ModalProps['isOpen']
  onClose: ModalProps['onClose']
}

function CommandModal({ isOpen, onClose }: CommandModalProps) {
  const [focusedItem, setFocusedItem] = useState(0)
  const [selectedItem, setSelectedItem] = useState(0)

  const handleInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowUp': {
        setFocusedItem((old) =>
          old - 1 < 0 ? commandItems.length - 1 : old - 1
        )
        break
      }
      case 'ArrowDown': {
        setFocusedItem((old) =>
          old + 1 > commandItems.length - 1 ? 0 : old + 1
        )
        break
      }
      case 'Enter': {
        setSelectedItem(focusedItem)
        break
      }
      default:
        break
    }
  }

  return (
    <Modal
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="scale"
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding="2">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              placeholder="Enter Command"
              border="none"
              _focus={{ border: 'none' }}
              width="full"
              // autoFocus={true}
              onKeyDown={handleInputKeydown}
            />
          </InputGroup>
        </ModalHeader>
        <ModalBody pb={4} paddingX="4">
          <List spacing={3}>
            {commandItems.map((v, i) => (
              <CommandItem
                key={`a${i}`}
                id="add"
                title="Note Manager"
                subtitle="Add new Mediocre Note. Make something awesome!"
                icon={AiOutlineEnter}
                focused={focusedItem === i}
                selected={selectedItem === i}
              />
            ))}
          </List>
        </ModalBody>
        {/* <ModalFooter display="flex" justifyContent="start">
          <Button colorScheme="blue" mr={1} size="xs">
            Save
          </Button>
          <Button onClick={onClose} size="xs">
            Cancel
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(CommandModal)
