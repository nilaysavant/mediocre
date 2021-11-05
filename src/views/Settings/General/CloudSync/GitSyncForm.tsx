import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Spacer, Text } from '@chakra-ui/layout'
import { Formik, Form } from 'formik'
import { CSSProperties } from 'react'
import StepperBottomBar from './StepperBottomBar'

/**
  // Ref For file selector:
  ```jsx
  <FormControl
    isInvalid={!!errors.sshKeyLocation && touched.sshKeyLocation}
  >
    <FormLabel>
      <Text>SSH key location</Text>
    </FormLabel>
    <FormLabel
      htmlFor="sshKeyLocation"
      borderStyle="solid"
      borderColor="gray.600"
      borderWidth="thin"
      borderRadius="md"
      w="full"
      py="2"
      px="4"
      cursor="pointer"
    >
      {values.sshKeyLocation ? (
        <Text>{values.sshKeyLocation}</Text>
      ) : (
        <Text color="gray.500">SSH key location</Text>
      )}
    </FormLabel>
    <Input
      onChange={handleChange}
      onBlur={handleBlur}
      id="sshKeyLocation"
      type="file"
      display="none"
      placeholder="SSH key location"
    />
    <FormErrorMessage>{errors.sshKeyLocation}</FormErrorMessage>
  </FormControl>
  ```
 */

export type GitSyncFormProps = {
  formStyle?: CSSProperties
  children?: React.ReactNode
}

const GitSyncForm = ({ formStyle, children }: GitSyncFormProps) => {
  return (
    <Formik
      initialValues={{ sshKeyLocation: '' }}
      validate={(values) => {
        if (!values.sshKeyLocation)
          return {
            name: 'Required',
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
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              id="sshKeyLocation"
              placeholder="SSH key Location"
            />
            <FormErrorMessage>{errors.sshKeyLocation}</FormErrorMessage>
          </FormControl>
          <Spacer />
          <StepperBottomBar
            onNext={handleSubmit}
            onBack={() => null}
            nextButtonIsLoading={isSubmitting}
            currentStepIndex={1}
            maxSteps={4}
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
