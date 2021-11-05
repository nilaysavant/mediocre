import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Circle, Flex, Stack } from '@chakra-ui/layout'
import { Formik, Form } from 'formik'
import SettingsButton from '../../SettingsButton'

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
          <Flex alignItems="center" justifyContent="space-between" mt={4}>
            <Stack direction="row" p="2">
              <Circle bg="icon.dark.400" size="10px" />
              <Circle bg="gray.600" size="10px" />
              <Circle bg="gray.600" size="10px" />
            </Stack>
            <Stack direction="row">
              <SettingsButton colorScheme="gray">
                Back
              </SettingsButton>
              <SettingsButton isLoading={isSubmitting} type="submit">
                Next
              </SettingsButton>
            </Stack>
          </Flex>
        </Form>
      )}
    </Formik>
  )
}

export default GitSyncForm
