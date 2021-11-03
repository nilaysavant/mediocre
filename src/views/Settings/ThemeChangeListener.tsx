import { useEffect } from 'react'
import { useReduxSelector } from 'src/redux/hooks'

/**
 * For allowing changes to theme css vars on
 * theme changes in redux state.
 */
const ThemeChangeListener = () => {
  const bgColors = useReduxSelector((state) => state.theme.colors.bg.dark)

  useEffect(() => {
    /** this sets the theme on change of redux state */
    Object.entries(bgColors).map(([key, value]) => {
      document.documentElement.style.setProperty(
        `--chakra-colors-bg-dark-${key}`,
        value
      )
    })
  }, [bgColors])

  return null
}

export default ThemeChangeListener
