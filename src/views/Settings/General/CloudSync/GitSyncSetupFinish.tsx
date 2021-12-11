import {
  Box,
  Flex,
  ListItem,
  Spacer,
  Text,
  UnorderedList,
} from '@chakra-ui/layout'
import { Code } from '@chakra-ui/react'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { Tag } from '@chakra-ui/tag'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import StepperBottomBar from './StepperBottomBar'
import CloudSyncStepperContext from './StepperContext'

export type GitSyncSetupFinishProps = any

const GitSyncSetupFinish = ({}: GitSyncSetupFinishProps) => {
  const dispatch = useReduxDispatch()
  const isSyncEnabled = useReduxSelector((state) => state.cloudSync.enabled)
  const cloudSyncService = useReduxSelector((state) =>
    state.cloudSync.service?.provider === 'git' ? state.cloudSync.service : null
  )
  const syncMessages = useReduxSelector(
    (state) => state.cloudSync.status.messages
  )
  const stepperContext = useContext(CloudSyncStepperContext)

  return (
    <>
      <Table size="sm" variant="simple" my="2">
        <Tbody>
          <Tr>
            <Td p="1" color="#abcad9" fontSize="sm">
              Git Sync Status
            </Td>
            <Td p="1" fontSize="sm">
              <Tag fontSize="xs" colorScheme="green">
                {isSyncEnabled ? 'Active' : 'Inactive'}
              </Tag>
            </Td>
          </Tr>
          <Tr>
            <Td p="1" fontSize="sm" color="#abcad9">
              Repository URL
            </Td>
            <Td p="1" fontSize="sm">
              <Tag fontSize="xs" colorScheme="orange">
                {cloudSyncService?.repoUrl}
              </Tag>
            </Td>
          </Tr>
          <Tr>
            <Td p="1" fontSize="sm" color="#abcad9">
              user.name
            </Td>
            <Td p="1" fontSize="sm">
              <Tag fontSize="xs" colorScheme="blue">
                {cloudSyncService?.configUserName}
              </Tag>
            </Td>
          </Tr>
          <Tr>
            <Td p="1" fontSize="sm" color="#abcad9">
              user.email
            </Td>
            <Td p="1" fontSize="sm">
              <Tag fontSize="xs" colorScheme="red">
                {cloudSyncService?.configUserEmail}
              </Tag>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Spacer />
      <StepperBottomBar
        onNext={stepperContext.onClose}
        onBack={stepperContext.onBack}
        nextButtonIsLoading={false}
        currentStepIndex={stepperContext.currentStep}
        maxSteps={stepperContext.maxSteps}
        containerProps={{
          mt: '4',
        }}
        nextButtonProps={{
          children: 'Finish',
        }}
        backButtonProps={{
          disabled: true,
        }}
      />
    </>
  )
}

export default GitSyncSetupFinish
