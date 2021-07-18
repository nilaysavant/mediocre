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
  writeDocumentToRelativePath,
} from '../../functions/fileSystem'
import { RootState } from '../../redux/store'
import { updateRawText } from '../../utils/markdownParser/markdownParserSlice'
import { prettifyText } from '../../utils/prettierFns'

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
  /** If current store content is synced with fs (represents fs data sync) */
  synced: boolean
  /**
   * If current editor content is synced with store (represents frontend data sync).
   * Complete sync is when both synced and saved are true.
   */
  saved: boolean
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
export const globalDocumentsListFetch = createAsyncThunk(
  'documents/globalDocumentsListFetch',
  async (_arg, thunkAPI) => {
    const response = await fetchDocumentsMetadata()
    return response
  }
)

/**
 * Async thunk action to open and read document
 * from file system. Uses Tauri command.
 */
export const globalDocumentOpen = createAsyncThunk<
  string | undefined,
  { documentId: string }
>('documents/globalDocumentOpen', async (arg, { getState, dispatch }) => {
  const { documentId } = arg
  const document = (getState() as RootState).documents.all.entities[documentId]
  if (!document)
    throw new Error(`document invalid! document with documentId not available`)
  const { relativePath, synced, content } = document
  if (!relativePath) throw new Error(`relativePath invalid!`)
  let updatedContent
  /** if already synced return the existing content */
  if (synced) updatedContent = content
  // else update content from fs
  else updatedContent = await readDocumentFromRelativePath(relativePath)
  /** Update editor text */
  dispatch(updateRawText(updatedContent || ''))
  return updatedContent
})

/**
 * Async thunk action to save/write document
 * to file system. Uses Tauri command.
 */
export const globalDocumentSave = createAsyncThunk<string, void>(
  'documents/globalDocumentSave',
  async (arg, { getState, dispatch }) => {
    const selectedDocumentId = (getState() as RootState).documents
      .selectedDocument
    const document = (getState() as RootState).documents.all.entities[
      selectedDocumentId
    ]
    const rawText = (getState() as RootState).markdownParser.rawText
    const updatedContent = prettifyText(rawText) // prettify unformatted raw text content
    if (!document)
      throw new Error(
        `document invalid! document with selectedDocumentId not available`
      )
    const { relativePath, content } = document
    if (!relativePath) throw new Error(`relativePath invalid!`)
    /** Verify if content on fs is changed */
    const contentOnFs = await readDocumentFromRelativePath(relativePath)
    if (contentOnFs !== content)
      throw new Error(
        'Content on file system is changed! Please reload the app'
      )
    const response = await writeDocumentToRelativePath(
      relativePath,
      updatedContent
    )
    if (!response?.status) throw new Error('Response status is invalid!')
    dispatch(updateRawText(updatedContent)) // Update the md raw text as well
    return updatedContent
  }
)

/**
 * Async thunk action to add/create a new document
 * from file system. Uses Tauri command.
 */
export const globalDocumentAdd = createAsyncThunk<
  void,
  { documentFileName: string }
>('documents/globalDocumentAdd', async (arg, { getState, dispatch }) => {
  const { documentFileName } = arg // get documentFileName
  /** write to fs, using fileName as relative oath atm as we're creating docs at the top level */
  const response = await writeDocumentToRelativePath(documentFileName, '')
  if (!response?.status) throw new Error(`Response status is invalid!`)
  /** Refetch all docs info */
  const result = await dispatch(globalDocumentsListFetch()).unwrap()
  if (!result) throw new Error(`Result invalid!`)
  const newDocument = result?.find(
    (doc) => doc.fileRelativePath === documentFileName
  )
  if (!newDocument) throw new Error(`newDocument invalid`)
  /** Open the newDocument with id being the filePath of it */
  dispatch(globalDocumentOpen({ documentId: newDocument.filePath }))
})

/** Mediocre DocumentSlice State */
export type DocumentsState = {
  all: EntityState<MediocreDocument>
  selectedDocument: string
  isDocumentsFetching: boolean
  isDocumentOpening: boolean
  isDocumentSaving: boolean
  isDocumentAdding: boolean
}

const initialState: DocumentsState = {
  all: documentsAdapter.getInitialState(),
  selectedDocument: '',
  isDocumentsFetching: false,
  isDocumentOpening: false,
  isDocumentSaving: false,
  isDocumentAdding: false,
}

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    /** Dispatched on local document create/add */
    documentAdd: (state, action: PayloadAction<MediocreDocument>) => {
      documentsAdapter.addOne(state.all, action.payload)
    },
    /** Dispatched on local document update(s) */
    documentUpdate: (
      state,
      action: PayloadAction<Update<MediocreDocument>>
    ) => {
      documentsAdapter.updateOne(state.all, action.payload)
    },
    /** Dispatched on local document delete */
    documentDelete: (state, action: PayloadAction<EntityId>) => {
      documentsAdapter.removeOne(state.all, action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Add reducers for additional action types here, and handle loading state as needed
      .addCase(globalDocumentsListFetch.pending, (state, _action) => {
        state.isDocumentsFetching = true
      })
      .addCase(globalDocumentsListFetch.fulfilled, (state, action) => {
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
            saved: true,
            modified: docMeta.modified || '',
          }))
        /** Set all documents from fetched documents */
        if (allDocuments) {
          /** Set all documents in store */
          documentsAdapter.setAll(state.all, allDocuments)
        } else console.error('allDocuments is undefined!')
        /** reset fetching state */
        state.isDocumentsFetching = false
      })
      .addCase(globalDocumentOpen.pending, (state, _action) => {
        state.isDocumentOpening = true
      })
      .addCase(globalDocumentOpen.fulfilled, (state, action) => {
        /** Set the selected document on Open */
        state.selectedDocument = action.meta.arg.documentId
        documentsAdapter.updateOne(state.all, {
          id: action.meta.arg.documentId,
          changes: {
            content: action.payload,
            synced: true,
          },
        })
        state.isDocumentOpening = false
      })
      .addCase(globalDocumentSave.pending, (state, _action) => {
        state.isDocumentSaving = true
      })
      .addCase(globalDocumentSave.fulfilled, (state, action) => {
        /** update the saved document ie. the current selected document */
        documentsAdapter.updateOne(state.all, {
          id: state.selectedDocument,
          changes: {
            content: action.payload,
            saved: true,
          },
        })
        state.isDocumentSaving = false
      })
      .addCase(globalDocumentAdd.pending, (state, _action) => {
        state.isDocumentAdding = true
      })
      .addCase(globalDocumentAdd.fulfilled, (state, action) => {
        state.isDocumentAdding = false
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
