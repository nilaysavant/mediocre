import React from 'react'
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

export type CommandItemProps = {
  id: string
  title: string
  subtitle: string
  icon: IconType
}

function CommandItem({ id, title, subtitle, icon }: CommandItemProps) {
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
      background="gray.800"
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
            />
          </InputGroup>
        </ModalHeader>
        <ModalBody pb={6} paddingX="4">
          <List spacing={3}>
            {[0, 1, 2, 3, 4].map((v, i) => (
              <CommandItem
                key={`a${i}`}
                id="add"
                title="Note Manager"
                subtitle="Add new Mediocre Note. Make something awesome!"
                icon={AiOutlineEnter}
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
