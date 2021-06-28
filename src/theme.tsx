// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

export const extendedChakraTheme = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles: {
    global: {
      body: {
        bg: 'none',
        // fontFamily: 'Nunito',
        // fontFamily: "Exo",
        // fontFamily: "Montserrat",
        fontFamily: "Roboto",
        // fontFamily: "Roboto Mono",
        // fontFamily: 'Fira Code',
      },
    },
  },
}

// 3. extend the theme
const theme = extendTheme(extendedChakraTheme)

export default theme
