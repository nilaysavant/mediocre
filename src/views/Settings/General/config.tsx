import { Box } from '@chakra-ui/react'
import { getUniqueIdV4 } from 'src/utils/idGenerator'
import CloudSync from './CloudSync'

export const generalSettingsSections: {
  id: string
  title: React.ReactNode
  content: React.ReactNode
}[] = [
  {
    id: getUniqueIdV4(),
    title: 'Cloud Sync',
    content: <CloudSync />,
  },
  {
    id: getUniqueIdV4(),
    title: 'Privacy',
    content: <Box>Privacy Content</Box>,
  },
]

export default null
