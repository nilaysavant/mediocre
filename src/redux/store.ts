import { configureStore } from '@reduxjs/toolkit'
import markdownParserSlice from '../utils/markdownParser/markdownParserSlice'
import commandModalSlice from '../components/CommandModal/commandModalSlice'
import counterSlice from '../utils/counterSlice'
import themeSlice from 'src/themeSlice'
import appSlice from '../appSlice'
import markdownThemeSlice from '../styles/markdown/markdownThemeSlice'
import documentsSlice from '../components/SideBar/documentsSlice'
import reduxLogger from 'redux-logger'

export const store = configureStore({
  reducer: {
    app: appSlice,
    markdownParser: markdownParserSlice,
    documents: documentsSlice,
    commandModal: commandModalSlice,
    markdownTheme: markdownThemeSlice,
    counter: counterSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(reduxLogger),
})

// @ts-expect-error Set global window.REDUX_STORE key to access redux store in dev
if (process.env.NODE_ENV === 'development') window.REDUX_STORE = store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
