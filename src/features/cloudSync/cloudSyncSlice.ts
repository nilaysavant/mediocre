import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { setupGitCloudSync, syncToGitCloud } from 'src/commands/cloudSync'
import { IsoDatetime } from 'src/commonTypes'
import { RootState } from '../../redux/store'

/**
 * Following entity based redux code
 * taken with ref from: https://redux-toolkit.js.org/api/createEntityAdapter
 */

/**
 * # Cloud Sync State
 *
 * Redux Slice state for Cloud Sync
 */
export type CloudSyncState = {
  /** If cloud sync is enabled */
  enabled: boolean
  /** last sync time  */
  lastSync: IsoDatetime
  /** Sync service */
  service?:
    | {
        provider?: 'git'
        /** git remote repo url */
        repoUrl: string
      }
    | {
        // not implemented
        provider?: 'dropbox'
        url: string
      }
}

// Define the initial state using that type
const initialState: CloudSyncState = {
  enabled: false,
  lastSync: '',
}

/**
 * # [Global] Setup Git Cloud Sync
 *
 * Global async action to Setup sync to git cloud.
 *
 * - returns boolean status: true: no-error
 */
export const globalSetupGitCloudSync = createAsyncThunk<
  { repoUrl: string },
  { repoUrl: string }
>(
  'markdownParser/globalSetupGitCloudSync',
  async (arg, { getState, dispatch }) => {
    const { repoUrl } = arg
    const response = await setupGitCloudSync(repoUrl)
    if (!response?.status) throw new Error(response?.message)
    return { repoUrl }
  }
)

/**
 * # [Global] Sync to Git Cloud
 *
 * Global async action to sync to git cloud.
 *
 * - returns boolean status: true: no-error
 */
export const globalSyncToGitCloud = createAsyncThunk<boolean, null>(
  'markdownParser/globalSyncToGitCloud',
  async (arg, { getState, dispatch }) => {
    const response = await syncToGitCloud()
    if (!response?.status) throw new Error(response?.message)
    return response.status
  }
)

export const cloudSyncSlice = createSlice({
  name: 'markdownParser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add reducers for additional action types here, and handle loading state as needed
      .addCase(globalSyncToGitCloud.fulfilled, (state, action) => {
        state.lastSync = dayjs().toISOString()
      })
      .addCase(globalSetupGitCloudSync.fulfilled, (state, action) => {
        state.service = {
          provider: 'git',
          repoUrl: action.payload.repoUrl,
        }
        state.enabled = true
        state.lastSync = dayjs().toISOString()
      })
  },
})

// Action creators are generated for each case reducer function
export const {} = cloudSyncSlice.actions

export default cloudSyncSlice.reducer
