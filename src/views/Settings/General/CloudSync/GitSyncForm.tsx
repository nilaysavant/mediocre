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
import { setupGitCloudSync, testGitCloneSSH } from 'src/functions/cloudSync'
import StepperBottomBar from './StepperBottomBar'
import CloudSyncStepperContext from './StepperContext'

export type GitSyncFormProps = {
  formStyle?: CSSProperties
}

const GitSyncForm = ({ formStyle }: GitSyncFormProps) => {
  const stepperContext = useContext(CloudSyncStepperContext)
  const [setupStatusMessage, setSetupStatusMessage] = useState<string[]>([])

  useEffect(() => {
    let unListen: (() => void) | null = null
    const setupEventListener = async () => {
      try {
        const tauriWindow = getCurrent()
        unListen = await tauriWindow.listen(
          'cloud_sync',
          ({ payload }) => {
            const { data } = payload as {
              data: {
                message: string
              }
              typ: 'DEBUG' | 'INFO' | 'ERROR'
            }
            setSetupStatusMessage((old) => [...old, data.message])
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
  }, [])

  return (
    <Formik
      initialValues={{ gitRepositoryUrl: '' }}
      validate={(values) => {
        if (!values.gitRepositoryUrl)
          return {
            gitRepositoryUrl: 'Required',
          }
      }}
      onSubmit={async (values, actions) => {
        try {
          actions.setSubmitting(true)
          await setupGitCloudSync(values.gitRepositoryUrl)
          // await sleep(3000)
          console.log(
            '🚀 ~ file: GitSyncForm.tsx ~ line 40 ~ onSubmit={ ~ values',
            values
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
          {setupStatusMessage.length ? (
            <UnorderedList mt="4" fontSize="sm">
              {setupStatusMessage.map((msg, idx) => (
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
