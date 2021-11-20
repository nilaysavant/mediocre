import { ListItem, Spacer, Text, UnorderedList } from '@chakra-ui/layout'
import { getCurrent } from '@tauri-apps/api/window'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import {
  globalSetupGitCloudSync,
  syncStatusPushMessage,
} from 'src/features/cloudSync/cloudSyncSlice'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import StepperBottomBar from './StepperBottomBar'
import CloudSyncStepperContext from './StepperContext'

export type GitSyncSetupProgressProps = any

const GitSyncSetupProgress = ({}: GitSyncSetupProgressProps) => {
  const dispatch = useReduxDispatch()
  const isSyncEnabled = useReduxSelector((state) => state.cloudSync.enabled)
  const gitRepositoryUrl = useReduxSelector((state) =>
    state.cloudSync.service?.provider === 'git'
      ? state.cloudSync.service.repoUrl
      : ''
  )
  const syncMessages = useReduxSelector(
    (state) => state.cloudSync.status.messages
  )
  const stepperContext = useContext(CloudSyncStepperContext)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let unListen: (() => void) | null = null
    const setupEventListener = async () => {
      try {
        const tauriWindow = getCurrent()
        unListen = await tauriWindow.listen(
          'setup_cloud_sync',
          ({ payload }) => {
            const { data } = payload as {
              data: {
                message: string
              }
              typ: 'DEBUG' | 'INFO' | 'ERROR'
            }
            dispatch(syncStatusPushMessage(data.message))
          }
        )
      } catch (error) {
        console.error(error)
      }
    }
    setupEventListener()
    return () => {
      if (unListen) unListen()
    }
  }, [dispatch])

  useEffect(() => {
    const setup = async () => {
      console.log(
        '🚀 ~ file: GitSyncSetupProgress.tsx ~ line 60 ~ setup ~ !isSyncEnabled && gitRepositoryUrl',
        !isSyncEnabled && gitRepositoryUrl
      )
      try {
        setIsLoading(true)
        if (!isSyncEnabled && gitRepositoryUrl)
          await dispatch(
            globalSetupGitCloudSync({ repoUrl: gitRepositoryUrl })
          ).unwrap()
      } catch (error) {
        console.error(error)
      }
      setIsLoading(false)
    }
    setup()
  }, [dispatch, gitRepositoryUrl, isSyncEnabled])

  return (
    <>
      {syncMessages.length ? (
        <UnorderedList mt="4" fontSize="sm">
          {syncMessages.map((msg, idx) => (
            <ListItem key={msg + idx}>{msg}</ListItem>
          ))}
        </UnorderedList>
      ) : null}
      <Spacer />
      <StepperBottomBar
        onNext={stepperContext.onNext}
        onBack={stepperContext.onBack}
        nextButtonIsLoading={isLoading}
        currentStepIndex={stepperContext.currentStep}
        maxSteps={stepperContext.maxSteps}
        containerProps={{
          mt: '4',
        }}
      />
    </>
  )
}

export default GitSyncSetupProgress
