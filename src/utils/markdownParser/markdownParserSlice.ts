import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { documentUpdate } from '../../components/Sidebar/documentsSlice'
import { RootState } from '../../redux/store'
import testMarkdown from '../../test/testMarkdown'
import { prettifyText } from '../prettierFns'

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

/**
 * Async thunk action fired when raw text of md parser
 * is changed
 */
export const rawTextUpdate = createAsyncThunk<string, { rawText: string }>(
  'markdownParser/rawTextUpdate',
  async (arg, { getState, dispatch }) => {
    /** Get selected document */
    const { selectedDocument: selectedDocumentId, all: allDocuments } = (
      getState() as RootState
    ).documents
    const selectedDocument = allDocuments.entities[selectedDocumentId] // get selected doc
    if (!selectedDocument) throw new Error('selectedDocumentId invalid!')
    if (selectedDocument.content.length < 1000 && arg.rawText.length < 1000) {
      // if content is small do a comparison
      const saved = selectedDocument.content === arg.rawText
      dispatch(
        documentUpdate({
          id: selectedDocumentId,
          changes: {
            saved,
          },
        })
      )
    }
    // for larger content set saved to false by default as comparison will be heavy op
    else
      dispatch(
        documentUpdate({
          id: selectedDocumentId,
          changes: {
            saved: false,
          },
        })
      )
    return arg.rawText
  }
)

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
    prettifyRawText: (state) => {
      state.rawText = prettifyText(state.rawText)
    },
  },
  extraReducers: (builder) => {
    builder
      // Add reducers for additional action types here, and handle loading state as needed
      .addCase(rawTextUpdate.fulfilled, (state, action) => {
        state.rawText = action.payload
      })
  },
})

// Action creators are generated for each case reducer function
export const { updateRawText, updateMdText, prettifyRawText } =
  markdownParserSlice.actions

export default markdownParserSlice.reducer
