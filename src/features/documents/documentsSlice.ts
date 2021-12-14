import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit'
import { History } from 'history'
import debounce from 'lodash/debounce'
import {
  fetchAllDocumentsMetadata,
  fetchDocumentMetaData,
  readDocumentFromRelativePath,
  removeDocumentFromRelativePath,
  renameDocumentAtRelativePath,
  writeDocumentToRelativePath,
} from '../../commands/fileSystem'
import { AppDispatch, RootState } from '../../redux/store'
import { updateRawText } from '../../utils/markdownParser/markdownParserSlice'
import { prettifyText } from '../../utils/prettierFns'
import { globalSyncToGitCloud } from '../cloudSync/cloudSyncSlice'

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
  relativePath?: string
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
 * Async thunk action that fetches documents list from
 * file system. Uses Tauri command.
 */
export const globalAllDocumentsListFetch = createAsyncThunk(
  'documents/globalAllDocumentsListFetch',
  async (_arg, thunkAPI) => {
    const response = await fetchAllDocumentsMetadata()
    return response
  }
)

/**
 * Async thunk action that fetches single document info(given the relative path) from
 * file system. Uses Tauri command.
 */
export const globalDocumentInfoFetch = createAsyncThunk<
  | {
      fileName: string
      filePath: string
      fileRelativePath?: string
      fileDir?: string | undefined
      fileType?: 'markdown' | undefined
      modified?: string | undefined
    }
  | undefined,
  { relativePath: string }
>('documents/globalDocumentInfoFetch', async ({ relativePath }, {}) => {
  const response = await fetchDocumentMetaData(relativePath)
  return response
})

/**
 * Async thunk action to open and read document
 * from file system. Uses Tauri command.
 */
export const globalDocumentOpen = createAsyncThunk<
  string | undefined,
  { documentId: string; history: History }
>('documents/globalDocumentOpen', async (arg, { getState, dispatch }) => {
  const { documentId, history } = arg
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
  history.push('/app/md-editor')
  return updatedContent
})

/**
 * Debounced version of cloud sync redux action function
 */
const debouncedDispatchSyncToGitCloud = debounce(
  (dispatch: AppDispatch) => {
    dispatch(globalSyncToGitCloud())
  },
  10000, // 10 secs min delay
  {
    maxWait: 20000, // max delay of 20 secs
  }
)

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
    /** dispatch for updating doc meta info into the store */
    await dispatch(globalDocumentInfoFetch({ relativePath })).unwrap()
    if (!response?.status) throw new Error('Response status is invalid!')
    dispatch(updateRawText(updatedContent)) // Update the md raw text as well
    debouncedDispatchSyncToGitCloud(dispatch)
    return updatedContent
  }
)

/**
 * Async thunk action to add/create a new document
 * from file system. Uses Tauri command.
 */
export const globalDocumentAdd = createAsyncThunk<
  void,
  { documentFileName: string; history: History }
>('documents/globalDocumentAdd', async (arg, { getState, dispatch }) => {
  const { documentFileName, history } = arg // get documentFileName
  /** write to fs, using fileName as relative path(temporary) atm as we're creating docs at the top level */
  const relativePath = documentFileName
  const response = await writeDocumentToRelativePath(relativePath, '')
  if (!response?.status) throw new Error(`Response status is invalid!`)
  /** fetch the doc info */
  const documentInfo = await dispatch(
    globalDocumentInfoFetch({ relativePath })
  ).unwrap()
  if (!documentInfo) throw new Error(`documentInfo invalid!`)
  /** Open the newDocument with id being the filePath of it */
  await dispatch(
    globalDocumentOpen({ documentId: documentInfo.filePath, history })
  ).unwrap()
})

/**
 * Async thunk action to delete/remove a document
 * from file system. Uses Tauri command.
 */
export const globalDocumentDelete = createAsyncThunk<
  void,
  { documentId: string; history: History }
>('documents/globalDocumentDelete', async (arg, { getState, dispatch }) => {
  const { documentId, history } = arg
  const document = (getState() as RootState).documents.all.entities[documentId]
  if (!document)
    throw new Error(`document invalid! document with documentId not available`)
  const { relativePath } = document
  if (!relativePath) throw new Error(`relativePath invalid!`)
  const result = await removeDocumentFromRelativePath(relativePath)
  if (!result?.status) throw new Error(`delete failed due to some reason`)
  /** Reset editor text */
  dispatch(updateRawText(''))
  history.push('/app')
})

/**
 * Async thunk action to rename existing document.
 * Uses Tauri command.
 */
export const globalDocumentRename = createAsyncThunk<
  void,
  { documentId: string; newDocumentName: string; history: History }
>('documents/globalDocumentRename', async (arg, { getState, dispatch }) => {
  const { documentId, newDocumentName, history } = arg // get documentFileName
  if (!newDocumentName) throw new Error(`newDocumentName invalid!`)
  const document = (getState() as RootState).documents.all.entities[documentId]
  if (!document)
    throw new Error(`document invalid! document with documentId not available`)
  const { relativePath } = document
  if (!relativePath) throw new Error(`relativePath invalid!`)
  const response = await renameDocumentAtRelativePath(
    relativePath,
    newDocumentName
  )
  if (!response?.status) throw new Error(`Response status is invalid!`)
  /** fetch the doc info */
  await dispatch(globalAllDocumentsListFetch()).unwrap()
})

/** Mediocre DocumentSlice State */
export type DocumentsState = {
  all: EntityState<MediocreDocument>
  selectedDocument: string
  isAllDocumentsFetching: boolean
  isDocumentFetching: boolean
  isDocumentOpening: boolean
  isDocumentSaving: boolean
  isDocumentAdding: boolean
  isDocumentDeleting: boolean
  isDocumentRenaming: boolean
  /** error message string */
  allDocumentsFetchingError?: string
  documentFetchingError?: string
  documentOpeningError?: string
  documentSavingError?: string
  documentAddingError?: string
  documentDeletingError?: string
  documentRenamingError?: string
}

const initialState: DocumentsState = {
  all: documentsAdapter.getInitialState(),
  selectedDocument: '',
  isAllDocumentsFetching: false,
  isDocumentFetching: false,
  isDocumentOpening: false,
  isDocumentSaving: false,
  isDocumentAdding: false,
  isDocumentDeleting: false,
  isDocumentRenaming: false,
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
      .addCase(globalAllDocumentsListFetch.pending, (state, _action) => {
        state.isAllDocumentsFetching = true
        state.allDocumentsFetchingError = undefined
      })
      .addCase(globalAllDocumentsListFetch.fulfilled, (state, action) => {
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
        state.isAllDocumentsFetching = false
      })
      .addCase(globalAllDocumentsListFetch.rejected, (state, action) => {
        state.isAllDocumentsFetching = false
        console.error(action.error)
        state.allDocumentsFetchingError = action.error.message
      })
      .addCase(globalDocumentInfoFetch.pending, (state, _action) => {
        state.isDocumentFetching = true
        state.documentFetchingError = undefined
      })
      .addCase(globalDocumentInfoFetch.fulfilled, (state, action) => {
        const docMeta = action.payload
        if (docMeta) {
          const document: MediocreDocument = {
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
          }
          /** using upsert as the document may or may not exist */
          documentsAdapter.upsertOne(state.all, document)
        } else console.error(`docMeta invalid!`)
        /** reset fetching state */
        state.isDocumentFetching = false
      })
      .addCase(globalDocumentInfoFetch.rejected, (state, action) => {
        state.isDocumentFetching = false
        console.error(action.error)
        state.documentFetchingError = action.error.message
      })
      .addCase(globalDocumentOpen.pending, (state, _action) => {
        state.isDocumentOpening = true
        state.documentOpeningError = undefined
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
      .addCase(globalDocumentOpen.rejected, (state, action) => {
        state.isDocumentOpening = false
        console.error(action.error)
        state.documentOpeningError = action.error.message
      })
      .addCase(globalDocumentSave.pending, (state, _action) => {
        state.isDocumentSaving = true
        state.documentSavingError = undefined
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
      .addCase(globalDocumentSave.rejected, (state, action) => {
        state.isDocumentSaving = false
        console.error(action.error)
        state.documentSavingError = action.error.message
      })
      .addCase(globalDocumentAdd.pending, (state, _action) => {
        state.isDocumentAdding = true
        state.documentAddingError = undefined
      })
      .addCase(globalDocumentAdd.fulfilled, (state, _action) => {
        state.isDocumentAdding = false
      })
      .addCase(globalDocumentAdd.rejected, (state, action) => {
        state.isDocumentAdding = false
        console.error(action.error)
        state.documentAddingError = action.error.message
      })
      .addCase(globalDocumentDelete.pending, (state, _action) => {
        state.isDocumentDeleting = true
        state.documentDeletingError = undefined
      })
      .addCase(globalDocumentDelete.fulfilled, (state, action) => {
        documentsAdapter.removeOne(state.all, action.meta.arg.documentId)
        state.selectedDocument = '' // clear selected doc
        state.isDocumentDeleting = false
      })
      .addCase(globalDocumentDelete.rejected, (state, action) => {
        state.isDocumentDeleting = false
        console.error(action.error)
        state.documentDeletingError = action.error.message
      })
      .addCase(globalDocumentRename.pending, (state, _action) => {
        state.isDocumentRenaming = true
        state.documentRenamingError = undefined
      })
      .addCase(globalDocumentRename.fulfilled, (state, _action) => {
        state.isDocumentRenaming = false
      })
      .addCase(globalDocumentRename.rejected, (state, action) => {
        state.isDocumentRenaming = false
        console.error(action.error)
        state.documentRenamingError = action.error.message
      })
  },
})
// Action creators are generated for each case reducer function
export const { documentAdd, documentUpdate, documentDelete } =
  documentsSlice.actions

// Can create a set of memoized selectors based on the location of this entity state
// ref: https://github.com/reduxjs/redux-toolkit/issues/497
export const documentsSelectors = documentsAdapter.getSelectors<RootState>(
  (state) => state?.documents?.all ?? { ids: [], entities: {} }
)

export default documentsSlice.reducer
