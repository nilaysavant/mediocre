import { Button } from '@chakra-ui/button'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Formik, Form } from 'formik'

const GitSyncForm = () => {
  return (
    <Formik
      initialValues={{ name: 'Sasuke' }}
      validate={(values) => {
        if (!values.name)
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
          <FormControl isInvalid={!!errors.name && touched.name}>
            <FormLabel htmlFor="name">First name</FormLabel>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              id="name"
              placeholder="name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default GitSyncForm
