import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { Box } from '@chakra-ui/layout'
import { IoGitBranch } from 'react-icons/io5'
import SettingsButton from '../../SettingsButton'
import SetupGitSyncModal from './SetupGitSyncModal'

const CloudSync = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <SettingsButton leftIcon={<IoGitBranch />} onClick={onOpen}>
        Setup Git Sync
      </SettingsButton>
      <SetupGitSyncModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default CloudSync
