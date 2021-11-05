import { Button } from '@chakra-ui/button'
import { CloseIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Stack } from '@chakra-ui/layout'
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
        <ModalCloseButton
          top="2.5"
          right="2.5"
          borderRadius="sm"
          zIndex="dropdown"
          w="auto"
          h="auto"
          p="1.5"
        />
        <Heading size="md" fontWeight="normal">
          Setup Git Sync
        </Heading>
        <hr />
        <Box pt="2">
          <GitSyncForm />
        </Box>
      </ModalContent>
    </Modal>
  )
}

export default SetupGitSyncModal
