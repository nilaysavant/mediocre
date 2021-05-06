import React, { useEffect, useState } from 'react'
import { tauri } from '@tauri-apps/api'
import { Box, useColorMode } from '@chakra-ui/react'
import './App.css'
import Editor from './components/Editor'
import Render from './components/Render'
import Topbar from './components/Topbar'
import theme from './theme'
import testMarkdown from './test/testMarkdown'
import { MdThemeContext, MdThemeTypes } from './styles/markdown'

function App() {
  const { colorMode } = useColorMode()
  const [sendText, setSendText] = useState<string>(testMarkdown)
  const [receivedText, setReceivedText] = useState<string>('')
  const [mdTheme, setMdTheme] = useState<MdThemeTypes>('solarized-dark')

  useEffect(() => {
    console.log('🚀 ~ file: index.tsx ~ line 60 ~ useMdTheme ~ theme', mdTheme)
  }, [mdTheme])

  useEffect(() => {
    const handleTextChange = async () => {
      const res: { markup: string } = await tauri.invoke('parse_md_to_mu', {
        mdString: sendText,
      })
      setReceivedText(res.markup)
    }
    handleTextChange()
  }, [sendText])

  return (
    <MdThemeContext.Provider
      value={{
        theme: mdTheme,
        setMdTheme,
      }}
    >
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: colorMode === 'dark' ? '#2b2b2b' : '#ffffff',
          fontSize: 18,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={2}
          height="full"
        >
          <Topbar />
          <Box
            display="flex"
            width="full"
            margin={1}
            rounded="sm"
            height="full"
            style={{
              border: `4px solid ${
                colorMode === 'dark' ? '#404040' : '#d4d4d4'
              }`,
            }}
          >
            <Editor text={sendText} setText={setSendText} />
            <Render markup={receivedText} />
          </Box>
        </Box>
      </div>
    </MdThemeContext.Provider>
  )
}

export default App
