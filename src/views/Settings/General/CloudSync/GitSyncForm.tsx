import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Formik, Form } from 'formik'
import SettingsButton from '../../SettingsButton'

const GitSyncForm = () => {
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
          <SettingsButton mt={4} isLoading={isSubmitting} type="submit">
            Submit
          </SettingsButton>
        </Form>
      )}
    </Formik>
  )
}

export default GitSyncForm
