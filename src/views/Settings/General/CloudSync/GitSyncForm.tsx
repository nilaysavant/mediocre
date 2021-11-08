import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input'
import { Spacer, Text } from '@chakra-ui/layout'
import { dialog } from '@tauri-apps/api'
import { Formik, Form } from 'formik'
import { CSSProperties, useContext } from 'react'
import { testGitCloneSSH } from 'src/functions/cloudSync'
import isTauri from 'src/utils/isTauri'
import sleep from 'src/utils/sleep'
import StepperBottomBar from './StepperBottomBar'
import CloudSyncStepperContext from './StepperContext'

export type GitSyncFormProps = {
  formStyle?: CSSProperties
}

const GitSyncForm = ({ formStyle }: GitSyncFormProps) => {
  const stepperContext = useContext(CloudSyncStepperContext)
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
          await testGitCloneSSH()
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
              <InputRightAddon p="1">
                <Button
                  fontWeight="normal"
                  fontSize="sm"
                  p="1"
                  h="auto"
                  bg="gray.500"
                  borderRadius="sm"
                  onClick={async () => {
                    try {
                      if (isTauri()) {
                        const filePath = await dialog.open()
                        if (!filePath || typeof filePath !== 'string')
                          throw new Error('invalid filePath received!')
                        setValues({ gitRepositoryUrl: filePath.toString() })
                      } else
                        throw new Error(`Cant execute outside Tauri runtime!`)
                    } catch (error) {
                      console.error(error)
                    }
                  }}
                >
                  Select File
                </Button>
              </InputRightAddon>
            </InputGroup>
            <FormErrorMessage>{errors.gitRepositoryUrl}</FormErrorMessage>
            <FormHelperText>
              Select the ssh key file from your system path.
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
