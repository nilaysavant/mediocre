import React from 'react'
import { Box } from '@chakra-ui/layout'
import { BoxProps, Spacer, Spinner, Text } from '@chakra-ui/react'

export type LoadingProps = {
  message?: string
} & BoxProps

const Loading = ({ message, ...rest }: LoadingProps) => {
  return (
    <Box display="flex" alignItems="center" opacity="0.4" {...rest}>
      {message ? (
        <>
          <Text fontSize="x-small">{message}</Text>
          <Spacer w="1" />
        </>
      ) : null}
      <Spinner width="0.7rem" height="0.7rem" />
    </Box>
  )
}

export default React.memo(Loading)
