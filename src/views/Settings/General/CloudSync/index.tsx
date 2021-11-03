import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { IoGitBranch } from 'react-icons/io5'

const CloudSync = () => {
  return (
    <Box>
      <Button
        leftIcon={<IoGitBranch />}
        iconSpacing="1"
        borderRadius="sm"
        fontWeight="normal"
        size="sm"
        colorScheme="telegram"
        p="1.5"
        height="auto"
      >
        Setup Git Sync
      </Button>
    </Box>
  )
}

export default CloudSync
