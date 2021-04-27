import React from 'react'
import 'github-markdown-css/github-markdown.css'

export interface Props {
  markup: string
}

function Render({ markup }: Props) {
  return (
    <div
      className="ml-0 flex-1 p-4 h-28 text-left h-full markdown-body"
      style={{
        background: '#1f1f1f',
        borderLeft: '4px solid #303030',
        color: '#ededed',
      }}
      dangerouslySetInnerHTML={{
        __html: markup || '<i>Type something...</i>',
      }}
    ></div>
  )
}

export default React.memo(Render)
