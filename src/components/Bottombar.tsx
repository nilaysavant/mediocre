import React from 'react'
import { Box, BoxProps } from '@chakra-ui/layout'

export type BottombarProps = BoxProps

function Bottombar({ ...rest }: BottombarProps) {
  return (
    <Box
      fontSize="sm"
      display="flex"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      {...rest}
    >
      <Box>File Name.md</Box>
      <Box display="flex" alignItems="center">
        l 21, c 12
      </Box>
    </Box>
  )
}

export default React.memo(Bottombar)
