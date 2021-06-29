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

// @ts-expect-error Set global window.REDUX_STORE key to access redux store in dev
if (process.env.NODE_ENV === 'development') window.REDUX_STORE = store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
