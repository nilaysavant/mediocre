import { Button } from '@chakra-ui/button'
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input'
import { dialog } from '@tauri-apps/api'
import isTauri from 'src/utils/isTauri'

export type FieldId = string

export type FileInputProps = {
  fieldId: FieldId
  values: { [key in FieldId]: string }
  handleChange: React.ChangeEventHandler<HTMLInputElement>
  handleBlur: React.FocusEventHandler<HTMLInputElement>
  setValues: (newValue: { [key in FieldId]: string }) => void
}

/**
 * ### File Input (Formik + Chakra + Tauri)
 * File Input/Selector for Formik forms with Chakra and Tauri
 */
const FileInput = ({
  handleChange,
  handleBlur,
  setValues,
  values,
  fieldId,
}: FileInputProps) => {
  return (
    <InputGroup size="sm">
      <Input
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[fieldId]}
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
                setValues({ [fieldId]: filePath.toString() })
              } else throw new Error(`Cant execute outside Tauri runtime!`)
            } catch (error) {
              console.error(error)
            }
          }}
        >
          Select File
        </Button>
      </InputRightAddon>
    </InputGroup>
  )
}

export default FileInput
