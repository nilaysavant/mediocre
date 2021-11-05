import React, { useCallback, useEffect, useState } from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import MonacoEditor, { loader, useMonaco } from '@monaco-editor/react'
import { Box } from '@chakra-ui/layout'
import { editor, IScrollEvent } from 'monaco-editor/esm/vs/editor/editor.api'
import { useReduxDispatch, useReduxSelector } from '../../redux/hooks'
import { globalRawTextUpdate } from '../../utils/markdownParser/markdownParserSlice'
import { handleClose, handleOpen } from '../CommandModal/commandModalSlice'
import { globalDocumentSave } from '../SideBar/documentsSlice'
import Loading from './Loading'

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
  const {
    isDocumentOpening,
    isDocumentSaving,
    isDocumentFetching,
    isDocumentDeleting,
  } = useReduxSelector((state) => state.documents)
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
      if (value !== undefined)
        dispatch(
          globalRawTextUpdate({
            rawText: value,
          })
        )
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
          'editor.background': '#16191d',
        },
        rules: [],
        encodedTokensColors: [],
      })
      /** Set the EOL preference */
      const model = monacoEditorObject?.getModel()
      model?.setEOL(0)
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
      /** Save Document shortcut */
      monacoEditorObject?.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        () => dispatch(globalDocumentSave())
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
      flex={1}
      height="full"
      borderRadius={0}
      fontSize="md"
      placeholder="Type something..."
      background={colorMode === 'dark' ? '#1f1f1f' : 'white'}
      borderWidth="1px"
      borderStyle="dotted"
      borderColor={colorMode === 'dark' ? 'border.dark.500' : '#e0e0e0'}
      borderLeft="none"
      borderY="none"
      outline="none"
      position="relative"
    >
      <Box position="absolute" zIndex="toast" bottom="0.5" right="1.5">
        {isDocumentFetching ? <Loading message="Fetching..." /> : null}
        {isDocumentOpening ? <Loading message="Opening..." /> : null}
        {isDocumentSaving ? <Loading message="Saving..." /> : null}
        {isDocumentDeleting ? <Loading message="Deleting..." /> : null}
      </Box>
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
