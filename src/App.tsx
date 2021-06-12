import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { editor, IScrollEvent } from 'monaco-editor'
import { CommandModalContext } from './components/CommandModalContext'

function App() {
  const { colorMode } = useColorMode()
  const [mdTheme, setMdTheme] = useState<MdThemeTypes>('solarized-dark')

  const renderBoxRef = useRef<HTMLDivElement>(null)
  const editorTextAreaRef = useRef<editor.IStandaloneCodeEditor>(null)

  // Command Modal
  const {
    isOpen: commandModalIsOpen,
    onOpen: handleCommandModalOpen,
    onClose: handleCommandModalClose,
  } = useDisclosure()

  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        if (commandModalIsOpen) handleCommandModalClose()
        else handleCommandModalOpen()
      }
    },
    [commandModalIsOpen, handleCommandModalClose, handleCommandModalOpen]
  )

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
          editorTextAreaRef.current.setScrollTop(
            Math.round(
              percentScroll * editorTextAreaRef.current.getScrollHeight()
            )
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

  const handleEditorScroll = (event: IScrollEvent) => {
    if (renderBoxRef.current) {
      const percentScroll = event.scrollTop / event.scrollHeight
      renderBoxRef.current.scrollTop = Math.round(
        percentScroll * renderBoxRef.current.scrollHeight
      )
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [handleGlobalKeyDown])

  return (
    <CommandModalContext.Provider
      value={{
        commandModalIsOpen,
        handleCommandModalClose,
        handleCommandModalOpen,
      }}
    >
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
              border: `4px solid ${
                colorMode === 'dark' ? '#404040' : '#d4d4d4'
              }`,
            }}
          >
            <Editor
              editorRef={editorTextAreaRef}
              onScroll={handleEditorScroll}
            />
            <Render renderBoxRef={renderBoxRef} onScroll={handleViewScroll} />
          </Box>
          <Bottombar height="2vh" />
          <CommandModal
            isOpen={commandModalIsOpen}
            onClose={handleCommandModalClose}
          />
        </Box>
      </MdThemeContext.Provider>
    </CommandModalContext.Provider>
  )
}

export default App
