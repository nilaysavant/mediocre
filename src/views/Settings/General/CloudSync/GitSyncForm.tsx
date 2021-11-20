import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input, InputGroup } from '@chakra-ui/input'
import { Box, ListItem, Spacer, Text, UnorderedList } from '@chakra-ui/layout'
import { getCurrent } from '@tauri-apps/api/window'
import { Formik, Form } from 'formik'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { setupGitCloudSync, testGitCloneSSH } from 'src/commands/cloudSync'
import {
  globalSetupGitCloudSync,
  syncStatusPushMessage,
} from 'src/features/cloudSync/cloudSyncSlice'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import StepperBottomBar from './StepperBottomBar'
import CloudSyncStepperContext from './StepperContext'

export type GitSyncFormProps = {
  formStyle?: CSSProperties
}

const GitSyncForm = ({ formStyle }: GitSyncFormProps) => {
  const dispatch = useReduxDispatch()
  const initialGitRepositoryUrl = useReduxSelector((state) =>
    state.cloudSync.enabled && state.cloudSync.service?.provider === 'git'
      ? state.cloudSync.service.repoUrl
      : ''
  )
  const syncMessages = useReduxSelector(
    (state) => state.cloudSync.status.messages
  )
  const stepperContext = useContext(CloudSyncStepperContext)

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

  return (
    <Formik
      initialValues={{ gitRepositoryUrl: initialGitRepositoryUrl }}
      validate={(values) => {
        if (!values.gitRepositoryUrl)
          return {
            gitRepositoryUrl: 'Required',
          }
      }}
      onSubmit={async (values, actions) => {
        try {
          actions.setSubmitting(true)
          await dispatch(
            globalSetupGitCloudSync({ repoUrl: values.gitRepositoryUrl })
          ).unwrap()
          actions.setSubmitting(false)
          stepperContext.onNext()
        } catch (error) {
          console.error(error)
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setValues,
      }) => (
        <Form
          style={{ display: 'flex', flexDirection: 'column', ...formStyle }}
        >
          <FormControl
            isInvalid={!!errors.gitRepositoryUrl && touched.gitRepositoryUrl}
          >
            <FormLabel htmlFor="gitRepositoryUrl" w="full">
              <Text>Git repository URL</Text>
            </FormLabel>
            <InputGroup size="sm">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gitRepositoryUrl}
                id="gitRepositoryUrl"
                placeholder="Git repository URL"
              />
            </InputGroup>
            <FormErrorMessage>{errors.gitRepositoryUrl}</FormErrorMessage>
            <FormHelperText>
              Enter the Git repository <b>SSH URL</b> for sync setup.
              <br />
              example: <b>git@github.com:user/mediocre-library.git</b>
            </FormHelperText>
          </FormControl>
          {syncMessages.length ? (
            <UnorderedList mt="4" fontSize="sm">
              {syncMessages.map((msg, idx) => (
                <ListItem key={msg + idx}>{msg}</ListItem>
              ))}
            </UnorderedList>
          ) : null}
          <Spacer />
          <StepperBottomBar
            onNext={handleSubmit}
            onBack={stepperContext.onBack}
            nextButtonIsLoading={isSubmitting}
            currentStepIndex={stepperContext.currentStep}
            maxSteps={stepperContext.maxSteps}
            containerProps={{
              mt: '4',
            }}
          />
        </Form>
      )}
    </Formik>
  )
}

export default GitSyncForm
