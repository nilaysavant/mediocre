import React, { useCallback, useEffect, useRef } from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { Textarea } from '@chakra-ui/textarea'
import prettier from 'prettier'
import parserMarkdown from 'prettier/parser-markdown'
import MonacoEditor, { loader, useMonaco } from '@monaco-editor/react'
import { Box } from '@chakra-ui/layout'
import { editor, IKeyboardEvent } from 'monaco-editor/esm/vs/editor/editor.api'

loader.config({
  paths: {
    vs: '/vs/',
  },
})

export interface Props {
  text: string
  setText: (value: string) => void
  editorRef?: React.RefObject<editor.IStandaloneCodeEditor>
  onScroll?: React.UIEventHandler<HTMLTextAreaElement>
}

function Editor({ text, setText, editorRef, onScroll }: Props) {
  const { colorMode } = useColorMode()
  const monaco = useMonaco()
  const monacoRef = useRef<editor.IStandaloneCodeEditor>(null)

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
    // @ts-expect-error cannot assign readonly
    monacoRef.current = editor
    // @ts-expect-error cannot assign readonly
    editorRef.current = editor
  }

  const handleEditorChange = useCallback(
    (value, event) => {
      if (value !== undefined) setText(value)
    },
    [setText]
  )

  useEffect(() => {
    if (monaco) {
      monacoRef.current?.addCommand(
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        () => {
          // onSave : ctrl + s
          const prettifiedText = prettier.format(text, {
            parser: 'markdown',
            plugins: [parserMarkdown],
          })
          setText(prettifiedText)
        }
      )
    }
  }, [monaco, monaco?.KeyCode.KEY_S, monaco?.KeyMod.CtrlCmd, setText, text])

  return (
    // <Textarea
    //   ref={editorRef}
    //   marginRight={0}
    //   flex={1}
    //   padding={4}
    //   height="full"
    //   borderRadius={0}
    //   fontSize="md"
    //   overflowX="auto"
    //   resize="none"
    //   _placeholder={{
    //     fontStyle: 'italic',
    //   }}
    //   _focus={{
    //     outline: 'none',
    //   }}
    //   placeholder="Type something..."
    //   value={text}
    //   onChange={(e) => setText(e.target.value)}
    //   onScroll={onScroll}
    //   onKeyDown={handleKeyDown}
    //   style={{
    //     background: colorMode === 'dark' ? '#1f1f1f' : 'white',
    //     borderRight: `4px solid ${
    //       colorMode === 'dark' ? '#4a4a4a' : '#e0e0e0'
    //     }`,
    //     overflow: 'auto',
    //     outline: 'none',
    //   }}
    // />
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
        value={text}
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
