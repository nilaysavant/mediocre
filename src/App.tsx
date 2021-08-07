import { Suspense } from 'react'
import { Box, Progress, useColorMode } from '@chakra-ui/react'
import './App.css'
import TopBar from './components/TopBar'
import CommandModal from './components/CommandModal'
import isTauri from './utils/isTauri'
import TitleBar from './components/TitleBar'
import ScrollReset from './utils/ScrollReset'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { renderRoutes } from 'react-router-config'
import routes from './routes'

const history = createBrowserHistory()

const App = () => {
  const { colorMode } = useColorMode()
  return (
    <Router history={history}>
      <Box
        width="100vw"
        height="100vh"
        background={colorMode === 'dark' ? '#2b2b2b' : '#ffffff'}
        fontSize={18}
        display="flex"
        flexDir="column"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.dark.600"
      >
        {isTauri() ? <TitleBar /> : null}
        <TopBar />
        <ScrollReset />
        <Suspense fallback={<Progress isIndeterminate size="xs" w="full" />}>
          {renderRoutes(routes)}
        </Suspense>
        <CommandModal />
      </Box>
    </Router>
  )
}

export default App
