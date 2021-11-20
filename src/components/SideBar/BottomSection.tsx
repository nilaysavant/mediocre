import React from 'react'
import { Box, BoxProps, Flex, FlexProps } from '@chakra-ui/layout'
import { Progress } from '@chakra-ui/progress'
import { Text } from '@chakra-ui/react'
import { useReduxSelector } from 'src/redux/hooks'

export type BottomSectionProps = {
  documentsCount: number
  containerProps?: FlexProps
}

const BottomSection = ({
  documentsCount = 0,
  containerProps,
}: BottomSectionProps) => {
  const isSyncEnabled = useReduxSelector((state) => state.cloudSync.enabled)
  const syncStatus = useReduxSelector((state) => state.cloudSync.status)
  return (
    <Flex direction="column" {...containerProps}>
      {isSyncEnabled && syncStatus ? (
        <>
          {syncStatus.messages.length || syncStatus.lastSync ? (
            <Flex direction="column" bg="bg.dark.350" p="1">
              {syncStatus.messages.length ? (
                <Text fontSize="xs" isTruncated color="#ababab">
                  {syncStatus.messages[syncStatus.messages.length - 1]}
                </Text>
              ) : null}
              {syncStatus.lastSync ? (
                <Text fontSize="x-small" isTruncated color="#ababab">
                  {syncStatus.lastSync}
                </Text>
              ) : null}
            </Flex>
          ) : null}
          {syncStatus.isSyncing ? <Progress h="0.5" isIndeterminate /> : null}
        </>
      ) : null}
      <Flex bg="bg.dark.350" p="1" alignItems="center">
        <Box bg="#ffffff17" px="2" mr="1" fontSize="xs" borderRadius="none">
          {documentsCount}
        </Box>
        <Text isTruncated color="#ababab">
          Documents
        </Text>
      </Flex>
    </Flex>
  )
}

export default React.memo(BottomSection)
