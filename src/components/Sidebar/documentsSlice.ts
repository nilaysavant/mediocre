import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit'
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
}

/** Create entity adapter */
const documentsAdapter = createEntityAdapter<MediocreDocument>({
  // Point to the field used as id
  selectId: (document) => document.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.modified.localeCompare(b.modified),
})

export const documentsSlice = createSlice({
  name: 'documents',
  initialState: documentsAdapter.getInitialState(),
  reducers: {
    /**
     * Add new document
     */
    addDocument: documentsAdapter.addOne,
    /**
     * Update document by id
     */
    updateDocument: documentsAdapter.updateOne,
    /**
     * Delete document by id
     */
    deleteDocument: documentsAdapter.removeOne,
  },
})
// Action creators are generated for each case reducer function
export const { addDocument, updateDocument, deleteDocument } =
  documentsSlice.actions

// Can create a set of memoized selectors based on the location of this entity state
// ref: https://github.com/reduxjs/redux-toolkit/issues/497
export const documentsSelectors = documentsAdapter.getSelectors<RootState>(
  (state) => state.documents
)

export default documentsSlice.reducer
