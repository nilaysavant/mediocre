import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ColorModeScript } from '@chakra-ui/color-mode'
import theme from './theme'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'
import { Router } from 'react-router-dom'
import history from './browserHistory'
import { PersistGate } from 'redux-persist/integration/react'
// import "@fontsource/nunito"
// import "@fontsource/exo"
// import "@fontsource/montserrat"
import '@fontsource/roboto'
import '@fontsource/roboto-mono'
// import "@fontsource/fira-code"

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
          <Router history={history}>
            <App />
          </Router>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
