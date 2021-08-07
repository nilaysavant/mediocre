import React, { MouseEvent, useCallback, useEffect, useRef } from 'react'
import { Box } from '@chakra-ui/react'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import { editor, IScrollEvent } from 'monaco-editor'
import {
  handleClose,
  handleOpen,
} from 'src/components/CommandModal/commandModalSlice'
import { shell } from '@tauri-apps/api'
import isTauri from 'src/utils/isTauri'
import Render from 'src/components/Render'
import Editor from 'src/components/Editor'

const Startup = () => {
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
    <Box flex="1" minWidth="0" display="flex" rounded="none" minHeight="0">
      <Editor editorRef={editorTextAreaRef} onScroll={handleEditorScroll} />
      <Render renderBoxRef={renderBoxRef} onScroll={handleViewScroll} />
    </Box>
  )
}

export default Startup
