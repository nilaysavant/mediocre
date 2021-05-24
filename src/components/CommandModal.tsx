import React from 'react'
import { Box } from '@chakra-ui/layout'
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
import { SearchIcon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/button'

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
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding={2}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              type="tel"
              placeholder="Enter Command"
              border="none"
              _focus={{ border: 'none' }}
            />
          </InputGroup>
        </ModalHeader>
        {/* <ModalBody pb={6}>Command Modal Body</ModalBody> */}
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
