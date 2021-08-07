import { Suspense } from 'react'
import { Box, Progress, useColorMode } from '@chakra-ui/react'
import './App.css'
import TopBar from './components/TopBar'
import CommandModal from './components/CommandModal'
import isTauri from './utils/isTauri'
import TitleBar from './components/TitleBar'
import ScrollReset from './utils/ScrollReset'
import { useLocation } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import { useEffect } from 'react'

const App = () => {
  const { colorMode } = useColorMode()
  const location = useLocation()

  useEffect(() => {
    console.log(
      '🚀 ~ file: App.tsx ~ line 21 ~ useEffect ~ location.pathname',
      location.pathname
    )
  }, [location.pathname])

  return (
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
  )
}

export default App
