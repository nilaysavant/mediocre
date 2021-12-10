import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input, InputGroup } from '@chakra-ui/input'
import { Code } from '@chakra-ui/react'
import { Box, ListItem, Spacer, Text, UnorderedList } from '@chakra-ui/layout'
import { getCurrent } from '@tauri-apps/api/window'
import { Formik, Form } from 'formik'
import { CSSProperties, useContext, useEffect } from 'react'
import {
  syncServiceUpdate,
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
  const cloudSyncService = useReduxSelector((state) =>
    state.cloudSync.service?.provider === 'git' ? state.cloudSync.service : null
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
      initialValues={{
        gitRepositoryUrl: cloudSyncService?.repoUrl ?? '',
        configUserName: cloudSyncService?.configUserName ?? '',
        configUserEmail: cloudSyncService?.configUserEmail ?? '',
      }}
      validate={(values) => {
        if (!values.gitRepositoryUrl)
          return {
            gitRepositoryUrl: 'Required',
          }
        if (!values.configUserName)
          return {
            configUserName: 'Required',
          }
        if (!values.configUserEmail)
          return {
            configUserEmail: 'Required',
          }
      }}
      onSubmit={async (values, actions) => {
        try {
          actions.setSubmitting(true)
          dispatch(
            syncServiceUpdate({
              provider: 'git',
              repoUrl: values.gitRepositoryUrl,
              configUserName: values.configUserName,
              configUserEmail: values.configUserEmail,
            })
          )
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
            <InputGroup size="sm">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.gitRepositoryUrl}
                id="gitRepositoryUrl"
                placeholder="repository URL"
              />
            </InputGroup>
            <FormErrorMessage>{errors.gitRepositoryUrl}</FormErrorMessage>
            <FormHelperText>
              Enter the Git repository <b>SSH URL</b> for sync setup.
              <br />
              example:{' '}
              <Code fontSize="small">
                git@github.com:user/mediocre-library.git
              </Code>
            </FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!errors.configUserName && touched.configUserName}
            mt="4"
          >
            <InputGroup size="sm">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.configUserName}
                id="configUserName"
                placeholder="user.name"
              />
            </InputGroup>
            <FormErrorMessage>{errors.configUserName}</FormErrorMessage>
            <FormHelperText>
              Enter values for{' '}
              <Code fontSize="small">git config user.name</Code>
            </FormHelperText>
          </FormControl>
          <FormControl
            isInvalid={!!errors.configUserEmail && touched.configUserEmail}
            mt="4"
          >
            <InputGroup size="sm">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.configUserEmail}
                id="configUserEmail"
                placeholder="user.email"
              />
            </InputGroup>
            <FormErrorMessage>{errors.configUserEmail}</FormErrorMessage>
            <FormHelperText>
              Enter values for{' '}
              <Code fontSize="small">git config user.email</Code>
            </FormHelperText>
          </FormControl>
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
