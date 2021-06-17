import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { Textarea } from '@chakra-ui/textarea'
import prettier from 'prettier'
import parserMarkdown from 'prettier/parser-markdown'
import MonacoEditor, { loader, useMonaco } from '@monaco-editor/react'
import { Box } from '@chakra-ui/layout'
import {
  editor,
  IKeyboardEvent,
  IScrollEvent,
} from 'monaco-editor/esm/vs/editor/editor.api'
import { CommandModalContext } from './CommandModalContext'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { updateRawText } from '../appSlice'

loader.config({
  paths: {
    vs: '/vs',
  },
})

export interface Props {
  editorRef?: React.RefObject<editor.IStandaloneCodeEditor>
  onScroll?: (e: IScrollEvent) => void
}

function Editor({ editorRef, onScroll }: Props) {
  const {
    commandModalIsOpen,
    handleCommandModalOpen,
    handleCommandModalClose,
  } = useContext(CommandModalContext)
  const { colorMode } = useColorMode()
  const monaco = useMonaco()
  const [monacoEditorObject, setMonacoEditorObject] = useState<editor.IStandaloneCodeEditor>()

  const rawText = useReduxSelector((state) => state.app.rawText)
  const dispatch = useReduxDispatch()

  function handleEditorWillMount(
    monaco: typeof import('monaco-editor/esm/vs/editor/editor.api')
  ) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  }

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import('monaco-editor/esm/vs/editor/editor.api')
  ) {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    setMonacoEditorObject(editor)
    // @ts-expect-error cannot assign readonly
    editorRef.current = editor
  }

  const handleEditorChange = useCallback(
    (value, event) => {
      if (value !== undefined) dispatch(updateRawText(value))
    },
    [dispatch]
  )

  useEffect(() => {
    if (monaco) {
      monacoEditorObject?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
        // onSave : ctrl + s
        const prettifiedText = prettier.format(rawText, {
          parser: 'markdown',
          plugins: [parserMarkdown],
        })
        dispatch(updateRawText(prettifiedText))
      })
      monacoEditorObject?.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KEY_Z, () => {
        // toggleWordWrap : alt + z
        monacoEditorObject?.updateOptions({
          wordWrap:
            monacoEditorObject.getOption(monaco.editor.EditorOption.wordWrap) === 'on'
              ? 'off'
              : 'on',
        })
      })
      monacoEditorObject?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K, () => {
        // toggleCommandBar : ctrl + k
        if (commandModalIsOpen) handleCommandModalClose()
        else handleCommandModalOpen()
      })
    }
  }, [
    commandModalIsOpen,
    handleCommandModalClose,
    handleCommandModalOpen,
    monaco,
    rawText,
    dispatch,
    monacoEditorObject,
  ])

  useEffect(() => {
    if (onScroll) {
      monacoEditorObject?.onDidScrollChange((e) => {
        onScroll(e)
      })
    }
  }, [monacoEditorObject, onScroll])

  return (
    <Box
      flex={1.1}
      height="full"
      borderRadius={0}
      fontSize="md"
      overflowX="auto"
      resize="none"
      placeholder="Type something..."
      // onScroll={onScroll}
      style={{
        background: colorMode === 'dark' ? '#1f1f1f' : 'white',
        borderRight: `4px solid ${
          colorMode === 'dark' ? '#4a4a4a' : '#e0e0e0'
        }`,
        overflow: 'auto',
        outline: 'none',
      }}
    >
      <MonacoEditor
        defaultLanguage="markdown"
        // defaultValue={text}
        value={rawText}
        onChange={handleEditorChange}
        theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
        height="100%"
        width="100%"
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    </Box>
  )
}

export default React.memo(Editor)
