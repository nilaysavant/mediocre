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
        300: 'rgb(46, 49, 52)',
        350: 'rgb(46, 50, 59)',
        400: 'rgb(35, 39, 48)',
        500: 'rgb(24, 28, 45)',
        600: 'rgb(30, 31, 32)',
      },
      editor: {
        /** Cannot be used inside monaco,
         * need to manually edit in that code */
        dark: 'rgb(22, 25, 29)',
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
