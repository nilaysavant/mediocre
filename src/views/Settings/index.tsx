import { SettingsIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/react'

const Settings = () => {
  return (
    <Box
      flex="1"
      minWidth="0"
      rounded="none"
      minHeight="0"
      bg="bg.dark.600"
      p="3"
    >
      <Box display="flex" alignItems="center" mb="1" fontSize="md">
        <SettingsIcon mr="2" color="icon.dark.400" />
        <Text>Settings</Text>
      </Box>
      <hr />
    </Box>
  )
}

export default Settings
