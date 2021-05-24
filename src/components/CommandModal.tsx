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
            />
          </InputGroup>
        </ModalHeader>
        <ModalBody pb={6} paddingX="4">
          <List spacing={3}>
            <ListItem
              display="flex"
              alignItems="center"
              _focus={{
                background: 'blue',
              }}
              paddingX="2"
              paddingY="2"
              tabIndex={0}
              borderRadius="md"
            >
              <ListIcon as={AddIcon} color="green.500" />
              <Box flex="1" paddingX="0.5">
                <Box fontSize="smaller" color="gray.400">
                  Note Properties
                </Box>
                <Box fontSize="medium" color="gray.100" lineHeight="shorter">
                  Create a new Mediocre Note. Write something awesome!
                </Box>
              </Box>
              <ListIcon as={AiOutlineEnter} color="blue.400" />
            </ListItem>
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
