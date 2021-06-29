import React from 'react'
import { Box, BoxProps } from '@chakra-ui/layout'
import { Icon, IconButton, Text } from '@chakra-ui/react'
import { BsPlus } from 'react-icons/bs'
import { useReduxDispatch } from '../../redux/hooks'
import { addDocument } from './documentsSlice'
import { getUniqueIdV4 } from '../../utils/idGenerator'

export type TopSectionProps = {
  dirName: string
} & BoxProps

const TopSection = ({ dirName, ...rest }: TopSectionProps) => {
  const dispatch = useReduxDispatch()

  return (
    <Box
      bg="#ffffff0d"
      px="1"
      py="0.18rem"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom="1px solid #ffffff12"
      color="#ebebebeb"
      fontSize="xs"
      width="full"
      {...rest}
    >
      <Text isTruncated>{dirName}</Text>
      <IconButton
        aria-label="Add new document"
        icon={<Icon as={BsPlus} />}
        color="#ebebebeb"
        minWidth="4"
        height="4"
        borderRadius="0"
        _focus={{
          boxShadow: '0px 0px 0px 1px #51a3f0b3',
        }}
        onClick={() =>
          dispatch(
            addDocument({
              id: getUniqueIdV4(),
              name: 'My New Doc.md',
              type: 'markdown',
              content: '',
              dir: 'my-projects',
              path: '/tmp',
              modified: new Date().toISOString(),
            })
          )
        }
      />
    </Box>
  )
}

export default React.memo(TopSection)
