import React from 'react'
import 'github-markdown-css/github-markdown.css'
import { useColorMode } from '@chakra-ui/color-mode'

export interface Props {
  markup: string
}

function Render({ markup }: Props) {
  const { colorMode } = useColorMode()
  return (
    <div
      className="ml-0 flex-1 p-4 h-28 text-left h-full markdown-body"
      style={{
        background: colorMode === 'dark' ? '#1f1f1f' : 'white',
        borderLeft: '4px solid #303030',
        color: colorMode === 'dark' ? '#ededed' : '#1f1f1f',
      }}
      dangerouslySetInnerHTML={{
        __html: markup || '<i>Type something...</i>',
      }}
    ></div>
  )
}

export default React.memo(Render)
