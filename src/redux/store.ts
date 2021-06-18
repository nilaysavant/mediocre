import { configureStore } from '@reduxjs/toolkit'
import appSlice from '../appSlice'
import commandModalSlice from '../components/CommandModal/commandModalSlice'
import counterSlice from '../utils/counterSlice'

export const store = configureStore({
  reducer: {
    app: appSlice,
    commandModal: commandModalSlice,
    counter: counterSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
