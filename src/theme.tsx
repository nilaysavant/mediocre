// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 3. extend the theme
const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles: {
    global: {
      body: {
        bg: "none",
      }
    }
  }
})

export default theme
