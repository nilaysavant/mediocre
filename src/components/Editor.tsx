import React, { useState } from 'react'

export interface Props {
  text: string
  setText: (value: string) => void
}

function Editor({ text, setText }: Props) {
  return (
    <textarea
      className="mr-0 resize-none flex-1 p-2 h-full"
      placeholder="Enter text to send"
      value={text}
      onChange={(e) => setText(e.target.value)}
      style={{
        background: '#1f1f1f',
        borderRight: '4px solid #4a4a4a',
        overflow: 'auto',
        outline: 'none',
      }}
    />
  )
}

export default React.memo(Editor)
