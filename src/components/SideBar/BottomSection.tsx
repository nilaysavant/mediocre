import React, { useEffect } from 'react'
import { Box, BoxProps, Flex, FlexProps } from '@chakra-ui/layout'
import { Progress } from '@chakra-ui/progress'
import { Text } from '@chakra-ui/react'
import { useReduxDispatch, useReduxSelector } from 'src/redux/hooks'
import { getCurrent } from '@tauri-apps/api/window'
import { syncStatusPushMessage } from 'src/features/cloudSync/cloudSyncSlice'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime) // extend dayjs with plugin

export type BottomSectionProps = {
  documentsCount: number
  containerProps?: FlexProps
}

const BottomSection = ({
  documentsCount = 0,
  containerProps,
}: BottomSectionProps) => {
  const dispatch = useReduxDispatch()
  const isSyncEnabled = useReduxSelector((state) => state.cloudSync.enabled)
  const syncStatus = useReduxSelector((state) => state.cloudSync.status)

  useEffect(() => {
    /**
     * Use effect for listening to push msg events on
     * Sync status
     */
    /** un-listen flag/function */
    let unListen: (() => void) | null = null
    const setupEventListener = async () => {
      try {
        const tauriWindow = getCurrent()
        unListen = await tauriWindow.listen('cloud_sync', ({ payload }) => {
          const { data } = payload as {
            data: {
              message: string
            }
            typ: 'DEBUG' | 'INFO' | 'ERROR'
          }
          dispatch(syncStatusPushMessage(data.message))
        })
      } catch (error) {
        console.error(error)
      }
    }
    setupEventListener()
    return () => {
      if (unListen) unListen()
    }
  }, [dispatch])

  return (
    <Flex direction="column" {...containerProps}>
      {isSyncEnabled && syncStatus ? (
        <>
          {syncStatus.messages.length || syncStatus.lastSync ? (
            <Flex direction="column" bg="bg.dark.350" p="1">
              {syncStatus.messages.length ? (
                <Text fontSize="x-small" isTruncated color="#ababab">
                  {syncStatus.messages[syncStatus.messages.length - 1]}
                </Text>
              ) : null}
              {syncStatus.lastSync ? (
                <Text fontSize="x-small" isTruncated color="#abababad">
                  {dayjs(syncStatus.lastSync).fromNow()}
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
