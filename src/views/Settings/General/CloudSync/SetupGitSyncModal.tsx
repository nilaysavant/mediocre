import { Heading } from '@chakra-ui/layout'
import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
} from '@chakra-ui/modal'
import React, { useState } from 'react'
import { useReduxSelector } from 'src/redux/hooks'
import { stepperScreens } from './config'
import CloudSyncStepperContext from './StepperContext'

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
  const isSyncEnabled = useReduxSelector((state) => state.cloudSync.enabled)
  const [currentStepIdx, setCurrentStepIdx] = useState(() =>
    isSyncEnabled ? stepperScreens.length - 1 : 0
  )
  return (
    <CloudSyncStepperContext.Provider
      value={{
        currentStep: currentStepIdx,
        maxSteps: stepperScreens.length,
        onNext: () =>
          setCurrentStepIdx((old) =>
            old < stepperScreens.length - 1
              ? old + 1
              : stepperScreens.length - 1
          ),
        onBack: () => setCurrentStepIdx((old) => (old > 0 ? old - 1 : 0)),
        onClose,
      }}
    >
      <Modal
        {...modalProps}
        initialFocusRef={initialFocusRef}
        finalFocusRef={finalFocusRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          p="3"
          borderRadius="sm"
          minHeight="sm"
          display="flex"
          flexDirection="column"
        >
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
            {stepperScreens[currentStepIdx].title}
          </Heading>
          <hr style={{ marginTop: '0.3rem' }} />
          {stepperScreens[currentStepIdx].content}
        </ModalContent>
      </Modal>
    </CloudSyncStepperContext.Provider>
  )
}

export default SetupGitSyncModal
