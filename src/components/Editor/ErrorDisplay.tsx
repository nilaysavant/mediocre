import React from 'react'
import { Box } from '@chakra-ui/layout'
import { BoxProps, Spacer, Text } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

export type ErrorDisplayProps = {
  message?: string
} & BoxProps

const ErrorDisplay = ({ message, ...rest }: ErrorDisplayProps) => {
  return (
    <Box display="flex" alignItems="center" opacity="0.4" maxWidth="22rem" {...rest}>
      {message ? (
        <>
          <Text fontSize="x-small" isTruncated>
            {message}
          </Text>
          <Spacer w="1" />
        </>
      ) : null}
      <WarningIcon width="0.7rem" height="0.7rem" color="red.500" />
    </Box>
  )
}

export default React.memo(ErrorDisplay)
