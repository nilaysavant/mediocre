import React, { useEffect, useRef, useState } from 'react'
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
  const [sendText, setSendText] = useState<string>(
    process.env.NODE_ENV === 'development' ? testMarkdown : ''
  )
  const [receivedText, setReceivedText] = useState<string>('')
  const [mdTheme, setMdTheme] = useState<MdThemeTypes>('solarized-dark')

  const renderBoxRef = useRef<HTMLDivElement>(null)
  const editorTextAreaRef = useRef<HTMLTextAreaElement>(null)

  const handleViewScroll = (
    event:
      | React.UIEvent<HTMLDivElement, UIEvent>
      | React.UIEvent<HTMLTextAreaElement, UIEvent>
  ) => {
    switch (event.currentTarget.nodeName.toLocaleLowerCase()) {
      case 'div': {
        if (editorTextAreaRef.current) {
          const percentScroll =
            event.currentTarget.scrollTop / event.currentTarget.scrollHeight
          editorTextAreaRef.current.scrollTop =
            percentScroll * editorTextAreaRef.current.scrollHeight
        }
        break
      }
      default:
        break
    }
  }

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
            <Editor
              text={sendText}
              setText={setSendText}
              editorRef={editorTextAreaRef}
              onScroll={handleViewScroll}
            />
            <Render
              markup={receivedText}
              renderBoxRef={renderBoxRef}
              onScroll={handleViewScroll}
            />
          </Box>
        </Box>
      </div>
    </MdThemeContext.Provider>
  )
}

export default App
