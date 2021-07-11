import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
  Update,
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
  initialState: {
    all: documentsAdapter.getInitialState(),
  },
  reducers: {
    /** Dispatched on new doc create/add */
    documentAdd: (state, action: PayloadAction<MediocreDocument>) => {
      documentsAdapter.addOne(state.all, action.payload)
    },
    /** Dispatched on document update(s) */
    documentUpdate: (
      state,
      action: PayloadAction<Update<MediocreDocument>>
    ) => {
      documentsAdapter.updateOne(state.all, action.payload)
    },
    /** Dispatched on document delete */
    documentDelete: (state, action: PayloadAction<EntityId>) => {
      documentsAdapter.removeOne(state.all, action.payload)
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(documentsListFetch.fulfilled, (state, action) => {
      /** get all the validated documents from the async fn */
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
      if (allDocuments) documentsAdapter.setAll(state.all, allDocuments)
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
  (state) => state.documents.all
)

export default documentsSlice.reducer
