import React from 'react'
import styles from './Editor.module.css'
import clsx from 'clsx'
import { useColorMode } from '@chakra-ui/color-mode'

export interface Props {
  text: string
  setText: (value: string) => void
}

function Editor({ text, setText }: Props) {
  const { colorMode } = useColorMode()
  return (
    <textarea
      className={clsx('mr-0 resize-none flex-1 p-4 h-full', styles.editor)}
      placeholder="Type something..."
      value={text}
      onChange={(e) => setText(e.target.value)}
      style={{
        background: colorMode === 'dark' ? '#1f1f1f' : 'white',
        borderRight: '4px solid #4a4a4a',
        overflow: 'auto',
        outline: 'none',
      }}
    />
  )
}

export default React.memo(Editor)
