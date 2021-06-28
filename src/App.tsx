import React, { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { Box, useColorMode } from '@chakra-ui/react'
import './App.css'
import Editor from './components/Editor'
import Render from './components/Render'
import Topbar from './components/Topbar'
import Bottombar from './components/Bottombar'
import CommandModal from './components/CommandModal'
import { editor, IScrollEvent } from 'monaco-editor'
import { useReduxDispatch, useReduxSelector } from './redux/hooks'
import {
  handleClose,
  handleOpen,
} from './components/CommandModal/commandModalSlice'
import { shell } from '@tauri-apps/api'
import isTauri from './utils/isTauri'
import Sidebar from './components/Sidebar'

const App = () => {
  const { colorMode } = useColorMode()
  const commandModalIsOpen = useReduxSelector(
    (state) => state.commandModal.isOpen
  )
  const dispatch = useReduxDispatch()
  const renderBoxRef = useRef<HTMLDivElement>(null)
  const editorTextAreaRef = useRef<editor.IStandaloneCodeEditor>(null)

  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        if (commandModalIsOpen) dispatch(handleClose())
        else dispatch(handleOpen())
      }
    },
    [commandModalIsOpen, dispatch]
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

  const handleGlobalClick = (e: unknown) => {
    const event = e as MouseEvent
    const element = event.target as HTMLAnchorElement
    if (
      element?.tagName === 'A' &&
      element?.href.startsWith('http') &&
      !element?.href.startsWith('http://localhost')
    ) {
      event.preventDefault()
      if (isTauri()) shell.open(element.href)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [handleGlobalKeyDown])

  return (
    <Box
      width="100vw"
      height="100vh"
      background={colorMode === 'dark' ? '#2b2b2b' : '#ffffff'}
      fontSize={18}
      display="flex"
      flexDir="column"
    >
      <Topbar />
      <Box flex="1" display="flex" rounded="none" minHeight="0">
        <Sidebar width="15%" />
        <Box
          flex="1"
          minWidth="0"
          display="flex"
          rounded="none"
          minHeight="0"
          border={`1px solid ${colorMode === 'dark' ? '#404040' : '#d4d4d4'}`}
        >
          <Editor editorRef={editorTextAreaRef} onScroll={handleEditorScroll} />
          <Render renderBoxRef={renderBoxRef} onScroll={handleViewScroll} />
        </Box>
      </Box>
      {/* <Bottombar /> */}
      <CommandModal />
    </Box>
  )
}

export default App
