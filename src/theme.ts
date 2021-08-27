// theme.js

// 1. import `extendTheme` function
import { extendTheme, ThemeOverride } from '@chakra-ui/react'

export const themeOverrides: ThemeOverride = {
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    /** for backgrounds */
    bg: {
      dark: {
        300: 'rgb(46, 49, 52)',
        350: 'rgb(46, 50, 59)',
        400: 'rgb(35, 39, 48)',
        500: 'rgb(29, 33, 38)',
        600: 'rgb(22, 25, 29)',
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
      focus: {
        500: 'rgba(81, 163, 240, 0.7)',
      },
    },
    /** for icons */
    icon: {
      dark: {
        400: 'rgb(135, 164, 198)',
        500: 'rgb(168, 183, 235)',
      },
    },
    /** vscode related colors */
    vscode: {
      dark: {
        sidebar: '#212121',
        bg: '#1f1f1f',
      },
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
