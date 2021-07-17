import React from 'react'
import { Box, BoxProps } from '@chakra-ui/layout'
import { Text } from '@chakra-ui/react'

export type BottomSectionProps = {
  documentsCount: number
} & BoxProps

const BottomSection = ({ documentsCount = 0, ...rest }: BottomSectionProps) => {
  return (
    <Box
      bg="bg.dark.350"
      p="1"
      display="flex"
      alignItems="center"
      {...rest}
    >
      <Box bg="#ffffff17" px="2" mr="1" fontSize="xs" borderRadius="none">
        {documentsCount}
      </Box>
      <Text isTruncated color="#ababab">
        Documents
      </Text>
    </Box>
  )
}

export default React.memo(BottomSection)
