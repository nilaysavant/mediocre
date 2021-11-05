import { Button } from '@chakra-ui/button'
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

export type SetupGitSyncModalProps = {
  isOpen: boolean
  onClose: () => void
  initialFocusRef?: ModalProps['initialFocusRef']
  finalFocusRef?: ModalProps['finalFocusRef']
  modalProps?: ModalProps
}

/**
 * ### Modal for git sync setup
 *
 * Used to setup git sync to cloud
 */
const SetupGitSyncModal = ({
  isOpen,
  onClose,
  initialFocusRef,
  finalFocusRef,
  modalProps,
}: SetupGitSyncModalProps) => {
  return (
    <Modal
      {...modalProps}
      initialFocusRef={initialFocusRef}
      finalFocusRef={finalFocusRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}></ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SetupGitSyncModal
