import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState = {
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
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateBgDark: (
      state,
      action: PayloadAction<
        Partial<typeof initialState['colors']['bg']['dark']>
      >
    ) => {
      state.colors.bg.dark = {
        ...state.colors.bg.dark,
        ...action.payload,
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateBgDark } = themeSlice.actions

export default themeSlice.reducer
