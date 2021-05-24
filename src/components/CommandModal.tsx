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

export type CommandModalProps = {
  isOpen: ModalProps['isOpen']
  onClose: ModalProps['onClose']
}

function CommandModal({ isOpen, onClose }: CommandModalProps) {
  return (
    <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input type="tel" placeholder="Enter Command" />
          </InputGroup>
        </ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody pb={6}>Command Modal Body</ModalBody>
        {/* <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

export default React.memo(CommandModal)
