import { SettingsIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { folder, Leva, useControls } from 'leva'
import { useEffect } from 'react'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import { updateBgDark } from 'src/themeSlice'
import TabBar from './TabBar'

const Settings = () => {
  const dispatch = useReduxDispatch()
  const themeBackgroundColors = useReduxSelector(
    (state) => state.theme.colors.bg.dark
  )
  const themeBackgroundSettings = useControls({
    'Theme Settings': folder({
      Background: folder({
        ...themeBackgroundColors,
      }),
    }),
  })

  useEffect(() => {
    dispatch(
      updateBgDark({
        ...themeBackgroundSettings,
      })
    )
  }, [dispatch, themeBackgroundSettings])

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
        <Leva
          fill
          flat
          titleBar={false}
          theme={{
            colors: {
              elevation2: 'transparent',
            },
          }}
        />
      </Box>
    </Box>
  )
}

export default Settings
