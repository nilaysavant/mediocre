import { SettingsIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import TabBar from './TabBar'

/**
 * Application Settings
 * @param param0
 * @returns
 */
const Settings = ({ route }: RouteConfigComponentProps) => {
  return (
    <Box
      flex="1"
      minWidth="0"
      rounded="none"
      minHeight="0"
      bg="bg.dark.600"
      p="3"
    >
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center" my="1.5" fontSize="md">
          <SettingsIcon mr="2" color="icon.dark.400" />
          <Text>Settings</Text>
        </Box>
        <TabBar ml="2" />
      </Box>
      <hr />
      <Box py="2">
        {renderRoutes(route?.routes, {
          someProp: 'these extra props are optional',
        })}
      </Box>
    </Box>
  )
}

export default Settings
