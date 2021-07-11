import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
import { fetchDocumentsMetadata } from '../../functions/fileSystem'
import { RootState } from '../../redux/store'

/**
 * Following entity based redux code
 * taken with ref from: https://redux-toolkit.js.org/api/createEntityAdapter
 */

/** Define a type entity */
export type MediocreDocument = {
  id: string
  name: string
  content: string
  dir: string
  path: string
  type: 'markdown'
  modified: string
  synced: boolean
}

/** Create entity adapter */
const documentsAdapter = createEntityAdapter<MediocreDocument>({
  // Point to the field used as id
  selectId: (document) => document.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.modified.localeCompare(b.modified),
})

/**
 * Async thunk action to fetch documents list from
 * file system. Uses Tauri command.
 */
export const documentsListFetch = createAsyncThunk(
  'documents/documentsListFetch',
  async (_arg, thunkAPI) => {
    const response = await fetchDocumentsMetadata()
    return response?.filesMetaInfo
  }
)

export const documentsSlice = createSlice({
  name: 'documents',
  initialState: documentsAdapter.getInitialState(),
  reducers: {
    /**
     * New document added
     */
    documentAdd: documentsAdapter.addOne,
    /**
     * Existing document updated
     */
    documentUpdate: documentsAdapter.updateOne,
    /**
     * Document Deleted
     */
    documentDelete: documentsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(documentsListFetch.fulfilled, (state, action) => {
      const allDocuments: MediocreDocument[] | undefined = action.payload?.map(
        (docMeta) => ({
          id: docMeta.filePath,
          name: docMeta.fileName,
          path: docMeta.filePath,
          dir: docMeta.fileDir || '',
          type: docMeta.fileType || 'markdown',
          content: '',
          synced: false,
          modified: docMeta.modified || '',
        })
      )
      /** Set all documents from fetched documents */
      if (allDocuments) documentsAdapter.setAll(state, allDocuments)
      else console.error('allDocuments is undefined!')
    })
  },
})
// Action creators are generated for each case reducer function
export const { documentAdd, documentUpdate, documentDelete } =
  documentsSlice.actions

// Can create a set of memoized selectors based on the location of this entity state
// ref: https://github.com/reduxjs/redux-toolkit/issues/497
export const documentsSelectors = documentsAdapter.getSelectors<RootState>(
  (state) => state.documents
)

export default documentsSlice.reducer
