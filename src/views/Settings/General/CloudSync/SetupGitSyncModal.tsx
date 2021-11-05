import { Button } from '@chakra-ui/button'
import { Stack } from '@chakra-ui/layout'
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
import SettingsButton from '../../SettingsButton'
import GitSyncForm from './GitSyncForm'

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
      <ModalContent p="3" borderRadius="sm">
        <ModalHeader p="0" >
          Setup Git Sync
        </ModalHeader>
        <ModalCloseButton top="2" right="2" borderRadius="sm" />
        <ModalBody p="0">
          <GitSyncForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SetupGitSyncModal
