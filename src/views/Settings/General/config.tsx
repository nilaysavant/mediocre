import { Box } from '@chakra-ui/react'
import { getUniqueIdV4 } from 'src/utils/idGenerator'

export const generalSettingsSections: {
  id: string
  title: React.ReactNode
  content: React.ReactNode
}[] = [
  {
    id: getUniqueIdV4(),
    title: 'Cloud Sync',
    content: <Box>Cloud Sync Content</Box>,
  },
  {
    id: getUniqueIdV4(),
    title: 'Privacy',
    content: <Box>Privacy Content</Box>,
  },
]

export default null
