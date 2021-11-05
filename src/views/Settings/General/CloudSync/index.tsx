import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { Box } from '@chakra-ui/layout'
import { IoGitBranch } from 'react-icons/io5'
import SetupGitSyncModal from './SetupGitSyncModal'

const CloudSync = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
        onClick={onOpen}
      >
        Setup Git Sync
      </Button>
      <SetupGitSyncModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default CloudSync
