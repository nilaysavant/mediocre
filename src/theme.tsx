// theme.js

// 1. import `extendTheme` function
import { extendTheme, ThemeOverride } from '@chakra-ui/react'

export const themeOverrides: ThemeOverride = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  colors: {
    /** for backgrounds */
    bg: {
      dark: {
        400: 'rgb(31, 40, 61)',
        500: 'rgb(24,28,45)',
      },
      editor: {
        /** Cannot be used inside monaco,
         * need to manually edit in that code */
        dark: '#16191d',
      },
    },
    border: {
      dark: {
        500: 'rgb(69, 76, 82)',
      },
    },
    /** vscode related colors */
    vscode: {
      dark: {
        sidebar: '#212121',
        bg: '#1f1f1f',
      },
    },
    /** for icons */
    icon: {
      dark: 'rgb(137,170,205)',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'none',
        /** font config */
        // fontFamily: 'Nunito',
        // fontFamily: "Exo",
        // fontFamily: "Montserrat",
        fontFamily: 'Roboto',
        // fontFamily: "Roboto Mono",
        // fontFamily: 'Fira Code',
      },
    },
  },
}

// 3. extend the theme
const theme = extendTheme(themeOverrides)

export default theme
