import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import testMarkdown from './test/testMarkdown'

// Define a type for the slice state
interface AppState {
  rawText: string
  mdText: string
}

// Define the initial state using that type
const initialState: AppState = {
  rawText: process.env.NODE_ENV === 'development' ? testMarkdown : '',
  mdText: '',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateRawText: (state, action: PayloadAction<string>) => {
      state.rawText = action.payload
    },
    updateMdText: (state, action: PayloadAction<string>) => {
      state.mdText = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateRawText, updateMdText } = appSlice.actions

export default appSlice.reducer
