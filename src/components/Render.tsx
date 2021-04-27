import React, { useState } from 'react'

export interface Props {
  markup: string
}

function Render({ markup }: Props) {
  return (
    <div
      className="ml-0 flex-1 p-2 h-28 text-left h-full"
      style={{
        whiteSpace: 'pre-line',
        background: '#1f1f1f',
        borderLeft: '4px solid #303030',
      }}
      dangerouslySetInnerHTML={{
        __html: markup,
      }}
    ></div>
  )
}

export default React.memo(Render)
