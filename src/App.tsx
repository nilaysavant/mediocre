import React, { useEffect, useRef, useState } from 'react'
import { tauri } from '@tauri-apps/api'
import { Box, useColorMode, useDisclosure } from '@chakra-ui/react'
import './App.css'
import Editor from './components/Editor'
import Render from './components/Render'
import Topbar from './components/Topbar'
import theme from './theme'
import testMarkdown from './test/testMarkdown'
import { MdThemeContext, MdThemeTypes } from './styles/markdown'
import Bottombar from './components/Bottombar'
import CommandModal from './components/CommandModal'

function App() {
  const { colorMode } = useColorMode()
  const [sendText, setSendText] = useState<string>(
    process.env.NODE_ENV === 'development' ? testMarkdown : ''
  )
  const [receivedText, setReceivedText] = useState<string>('')
  const [mdTheme, setMdTheme] = useState<MdThemeTypes>('solarized-dark')

  const renderBoxRef = useRef<HTMLDivElement>(null)
  const editorTextAreaRef = useRef<HTMLTextAreaElement>(null)

  // Command Modal
  const { isOpen, onOpen: handleCommandModalOpen, onClose } = useDisclosure()

  const handleGlobalKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'P') {
      event.preventDefault()
      handleCommandModalOpen()
    }
  }

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
          editorTextAreaRef.current.scrollTop = Math.round(
            percentScroll * editorTextAreaRef.current.scrollHeight
          )
        }
        break
      }
      case 'textarea': {
        if (renderBoxRef.current) {
          const percentScroll =
            event.currentTarget.scrollTop / event.currentTarget.scrollHeight
          renderBoxRef.current.scrollTop = Math.round(
            percentScroll * renderBoxRef.current.scrollHeight
          )
        }
        break
      }
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [])

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
      <Box
        paddingTop={2}
        paddingLeft={2}
        paddingRight={2}
        width="100vw"
        height="100vh"
        background={colorMode === 'dark' ? '#2b2b2b' : '#ffffff'}
        fontSize={18}
      >
        <Topbar height="5vh" />
        <Box
          display="flex"
          width="full"
          rounded="sm"
          height="89.5vh"
          marginY="1"
          style={{
            border: `4px solid ${colorMode === 'dark' ? '#404040' : '#d4d4d4'}`,
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
        <Bottombar height="2vh" />
        <CommandModal isOpen={isOpen} onClose={onClose} />
      </Box>
    </MdThemeContext.Provider>
  )
}

export default App
