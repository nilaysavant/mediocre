import { configureStore } from '@reduxjs/toolkit'
import markdownParserSlice from '../utils/markdownParser/markdownParserSlice'
import commandModalSlice from '../components/CommandModal/commandModalSlice'
import counterSlice from '../utils/counterSlice'
import appSlice from '../appSlice'
import markdownThemeSlice from '../styles/markdown/markdownThemeSlice'

export const store = configureStore({
  reducer: {
    app: appSlice,
    markdownParser: markdownParserSlice,
    commandModal: commandModalSlice,
    markdownTheme: markdownThemeSlice,
    counter: counterSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
