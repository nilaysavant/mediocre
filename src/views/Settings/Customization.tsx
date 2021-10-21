import { Box } from '@chakra-ui/react'
import { folder, Leva, useControls } from 'leva'
import { useEffect } from 'react'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import { updateBgDark } from 'src/themeSlice'

/**
 * Customization Settings
 * @returns
 */
const Customization = () => {
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
    <Box>
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
  )
}

export default Customization
