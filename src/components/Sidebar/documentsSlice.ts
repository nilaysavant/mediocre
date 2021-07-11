import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit'
import {
  fetchDocumentsMetadata,
  readDocumentFromRelativePath,
} from '../../functions/fileSystem'
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
  relativePath: string
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
    return response
  }
)

// /**
//  * Async thunk action to open and read document
//  * from file system. Uses Tauri command.
//  */
// export const documentOpen = createAsyncThunk<void, { a: string }>(
//   'documents/documentOpen',
//   async (arg, thunkAPI) => {
//     console.log('🚀 ~ file: documentsSlice.ts ~ line 61 ~ a', arg)
//     // const response = await readDocumentFromRelativePath()
//     // return response
//   }
// )

/** Mediocre DocumentSlice State */
export type DocumentsState = {
  all: EntityState<MediocreDocument>
  isDocumentsFetching: boolean
}

const initialState: DocumentsState = {
  all: documentsAdapter.getInitialState(),
  isDocumentsFetching: false,
}

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
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
    builder
      // Add reducers for additional action types here, and handle loading state as needed
      .addCase(documentsListFetch.pending, (state, action) => {
        state.isDocumentsFetching = true
      })
      .addCase(documentsListFetch.fulfilled, (state, action) => {
        /** get all the validated documents from the async fn */
        const allDocuments: MediocreDocument[] | undefined =
          action.payload?.map((docMeta) => ({
            id: docMeta.filePath,
            name: docMeta.fileName,
            path: docMeta.filePath,
            relativePath: docMeta.fileRelativePath,
            dir: docMeta.fileDir || '',
            type: docMeta.fileType || 'markdown',
            content: '',
            synced: false,
            modified: docMeta.modified || '',
          }))
        /** Set all documents from fetched documents */
        if (allDocuments) documentsAdapter.setAll(state.all, allDocuments)
        else console.error('allDocuments is undefined!')
        /** reset fetching state */
        state.isDocumentsFetching = false
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
