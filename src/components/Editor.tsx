import React from 'react'
import { useColorMode } from '@chakra-ui/color-mode'
import { Textarea } from '@chakra-ui/textarea'

export interface Props {
  text: string
  setText: (value: string) => void
}

function Editor({ text, setText }: Props) {
  const { colorMode } = useColorMode()
  return (
    <Textarea
      marginRight={0}
      flex={1}
      padding={4}
      height="full"
      borderRadius={0}
      fontSize="lg"
      overflowX="auto"
      resize="none"
      _placeholder={{
        fontStyle: 'italic',
      }}
      _focus={{
        outline: 'none',
      }}
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
