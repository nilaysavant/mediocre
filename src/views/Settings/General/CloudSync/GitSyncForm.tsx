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
import isTauri from 'src/utils/isTauri'
import StepperBottomBar from './StepperBottomBar'
import CloudSyncStepperContext from './StepperContext'

export type GitSyncFormProps = {
  formStyle?: CSSProperties
}

const GitSyncForm = ({ formStyle }: GitSyncFormProps) => {
  const stepperContext = useContext(CloudSyncStepperContext)
  return (
    <Formik
      initialValues={{ sshKeyLocation: '' }}
      validate={(values) => {
        if (!values.sshKeyLocation)
          return {
            sshKeyLocation: 'Required',
          }
      }}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
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
            isInvalid={!!errors.sshKeyLocation && touched.sshKeyLocation}
          >
            <FormLabel htmlFor="sshKeyLocation" w="full">
              <Text>SSH key Location</Text>
            </FormLabel>
            <InputGroup size="sm">
              <Input
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sshKeyLocation}
                id="sshKeyLocation"
                placeholder="SSH key Location"
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
                        setValues({ sshKeyLocation: filePath.toString() })
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
            <FormErrorMessage>{errors.sshKeyLocation}</FormErrorMessage>
            <FormHelperText>
              Select the ssh key file from your system path.
            </FormHelperText>
          </FormControl>
          <Spacer />
          <StepperBottomBar
            onNext={() => {
              // handleSubmit()
              stepperContext.onNext()
            }}
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
