import React, { useContext } from 'react'
import 'github-markdown-css/github-markdown.css'
import { useColorMode } from '@chakra-ui/color-mode'
import { Box } from '@chakra-ui/layout'
import clsx from 'clsx'
import { MdThemeContext } from '../styles/markdown'

export interface Props {
  markup: string
}

function Render({ markup }: Props) {
  const { colorMode } = useColorMode()
  const { theme: mdTheme } = useContext(MdThemeContext)
  return (
    <Box
      className={clsx(
        mdTheme === 'github2' ? 'markdown-body' : `markdown ${mdTheme}`
      )}
      marginLeft={0}
      flex={1}
      padding={4}
      textAlign="left"
      height="full"
      overflowY="auto"
      style={{
        background: colorMode === 'dark' ? '#1f1f1f' : 'white',
        borderLeft: `4px solid ${colorMode === 'dark' ? '#303030' : '#d6d6d6'}`,
        color: colorMode === 'dark' ? '#ededed' : '#1f1f1f',
      }}
      dangerouslySetInnerHTML={{
        __html: markup || '<i>Type something...</i>',
      }}
    ></Box>
  )
}

export default React.memo(Render)
