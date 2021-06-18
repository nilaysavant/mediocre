import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import testMarkdown from '../../test/testMarkdown'

// Define a type for the slice state
interface MarkdownParserState {
  rawText: string
  mdText: string
}

// Define the initial state using that type
const initialState: MarkdownParserState = {
  rawText: process.env.NODE_ENV === 'development' ? testMarkdown : '',
  mdText: '',
}

export const markdownParserSlice = createSlice({
  name: 'markdownParser',
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
export const { updateRawText, updateMdText } = markdownParserSlice.actions

export default markdownParserSlice.reducer
