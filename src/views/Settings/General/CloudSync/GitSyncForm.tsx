import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Circle, Flex, Stack } from '@chakra-ui/layout'
import { Formik, Form } from 'formik'
import SettingsButton from '../../SettingsButton'
import StepperBottomBar from './StepperBottomBar'

export type GitSyncFormProps = {
  children?: React.ReactNode
}

const GitSyncForm = ({ children }: GitSyncFormProps) => {
  return (
    <Formik
      initialValues={{ sshKeyLocation: 'Sasuke' }}
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
        <Form>
          <FormControl
            isInvalid={!!errors.sshKeyLocation && touched.sshKeyLocation}
          >
            <FormLabel htmlFor="sshKeyLocation">SSH key location</FormLabel>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              id="sshKeyLocation"
              placeholder="SSH key location"
            />
            <FormErrorMessage>{errors.sshKeyLocation}</FormErrorMessage>
          </FormControl>
          <StepperBottomBar
            onNext={handleSubmit}
            onBack={() => null}
            nextButtonIsLoading={isSubmitting}
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
