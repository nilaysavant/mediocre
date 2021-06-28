import React, { useCallback, useEffect, useState } from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import prettier from 'prettier'
import parserMarkdown from 'prettier/parser-markdown'
import MonacoEditor, { loader, useMonaco } from '@monaco-editor/react'
import { Box } from '@chakra-ui/layout'
import { editor, IScrollEvent } from 'monaco-editor/esm/vs/editor/editor.api'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import {
  prettifyRawText,
  updateRawText,
} from '../utils/markdownParser/markdownParserSlice'
import { handleClose, handleOpen } from './CommandModal/commandModalSlice'

loader.config({
  paths: {
    vs: '/vs',
  },
})

export interface Props {
  editorRef?: React.RefObject<editor.IStandaloneCodeEditor>
  onScroll?: (e: IScrollEvent) => void
}

const Editor = ({ editorRef, onScroll }: Props) => {
  const commandModalIsOpen = useReduxSelector(
    (state) => state.commandModal.isOpen
  )
  const rawText = useReduxSelector((state) => state.markdownParser.rawText)
  const dispatch = useReduxDispatch()
  const { colorMode } = useColorMode()
  const monaco = useMonaco()
  const [monacoEditorObject, setMonacoEditorObject] =
    useState<editor.IStandaloneCodeEditor>()

  const handleEditorWillMount = (
    monaco: typeof import('monaco-editor/esm/vs/editor/editor.api')
  ) => {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
  }

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    _monaco: typeof import('monaco-editor/esm/vs/editor/editor.api')
  ) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    setMonacoEditorObject(editor)
    // @ts-expect-error cannot assign readonly
    editorRef.current = editor
  }

  const handleEditorChange = useCallback(
    (value, _event) => {
      if (value !== undefined) dispatch(updateRawText(value))
    },
    [dispatch]
  )

  useEffect(() => {
    if (monaco) {
      /** Define theme */
      monaco.editor.defineTheme('mediocre-monaco-dark', {
        base: 'vs-dark',
        inherit: true,
        colors: {
          'scrollbar.shadow': '#00000000',
        },
        rules: [],
        encodedTokensColors: [],
      })
      /** Set initial options */
      monacoEditorObject?.updateOptions({
        wordWrap: 'on',
        scrollbar: {
          verticalScrollbarSize: 0,
        },
        minimap: {
          enabled: false,
        },
        lineNumbers: 'off',
        fontSize: 13,
        fontFamily: `"Droid Sans Mono", monospace, monospace, "Droid Sans Fallback"`,
        lineHeight: 20,
        padding: {
          top: 12,
        },
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 0,
        folding: false,
        glyphMargin: false,
      })
      /** toggleWordWrap : alt + z */
      monacoEditorObject?.addCommand(
        monaco.KeyMod.Alt | monaco.KeyCode.KEY_Z,
        () => {
          monacoEditorObject?.updateOptions({
            wordWrap:
              monacoEditorObject.getOption(
                monaco.editor.EditorOption.wordWrap
              ) === 'on'
                ? 'off'
                : 'on',
          })
        }
      )
    }
  }, [monaco, monacoEditorObject])

  useEffect(() => {
    if (monaco) {
      /** Set theme based on colorMode */
      monacoEditorObject?.updateOptions({
        theme: colorMode === 'dark' ? 'mediocre-monaco-dark' : 'light',
      })
    }
  }, [colorMode, monaco, monacoEditorObject])

  useEffect(() => {
    if (monaco) {
      /** toggleCommandBar : ctrl + k */
      monacoEditorObject?.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K,
        () => {
          if (commandModalIsOpen) dispatch(handleClose())
          else dispatch(handleOpen())
        }
      )
    }
  }, [commandModalIsOpen, dispatch, monaco, monacoEditorObject])

  useEffect(() => {
    if (monaco) {
      /** Prettify code shortcut */
      monacoEditorObject?.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        () => dispatch(prettifyRawText())
      )
    }
  }, [dispatch, monaco, monacoEditorObject])

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
      placeholder="Type something..."
      // onScroll={onScroll}
      background={colorMode === 'dark' ? '#1f1f1f' : 'white'}
      borderRight={`1px solid ${colorMode === 'dark' ? '#4a4a4a' : '#e0e0e0'}`}
      overflow="auto"
      outline="none"
    >
      <MonacoEditor
        defaultLanguage="markdown"
        // defaultValue={text}
        value={rawText}
        onChange={handleEditorChange}
        // theme={colorMode === 'dark' ? 'mediocre-monaco-dark' : 'light'}
        height="100%"
        width="100%"
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
      />
    </Box>
  )
}

export default React.memo(Editor)
