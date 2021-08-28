import { AddIcon } from '@chakra-ui/icons'
import { Box, Kbd, Text } from '@chakra-ui/react'
import AppLogoIcon from 'src/icons/AppLogoIcon'

const Startup = () => {
  return (
    <Box
      flex="1"
      minWidth="0"
      rounded="none"
      minHeight="0"
      bg="bg.dark.600"
      position="relative"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -80%)"
        display="flex"
        flexDir="column"
        alignItems="center"
      >
        <Box display="flex" flexDir="column" alignItems="center">
          <AppLogoIcon fontSize="10rem" />
          <Text>Mediocre Editor</Text>
        </Box>
        <Box>
          <Text
            color="gray.500"
            fontSize="md"
            display="flex"
            alignItems="center"
            whiteSpace="nowrap"
            isTruncated
          >
            Click{' '}
            <Kbd py="0.5" mx="1.5">
              <AddIcon fontSize="xs" />
            </Kbd>{' '}
            to create a new document
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default Startup
