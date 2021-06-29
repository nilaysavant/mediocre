import React from 'react'
import { Box, BoxProps } from '@chakra-ui/layout'
import { Circle, Text } from '@chakra-ui/react'

export type BottomSectionProps = {
  documentsCount: number
} & BoxProps

const BottomSection = ({ documentsCount = 0, ...rest }: BottomSectionProps) => {
  return (
    <Box
      bg="#2e2e2e"
      px="1"
      py="1.5"
      display="flex"
      alignItems="center"
      borderBottom="2px solid #ffffff1c"
      {...rest}
    >
      <Circle bg="#ffffff17" px="2.5" mr="1" fontSize="xs">
        {documentsCount}
      </Circle>
      <Text isTruncated color="#ababab">
        documents
      </Text>
    </Box>
  )
}

export default React.memo(BottomSection)
