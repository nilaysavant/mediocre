import { Button, ButtonProps } from '@chakra-ui/button'
import { Box, HStack, StackProps, Text } from '@chakra-ui/layout'
import { ReactNode } from 'react'
import { useLocation } from 'react-router'
import history from 'src/browserHistory'

export type TabButtonProps = {
  children: ReactNode
  active?: boolean
  onClick?: ButtonProps['onClick']
  buttonProps?: ButtonProps
}

const TabButton = ({
  children,
  active = false,
  onClick,
  buttonProps,
}: TabButtonProps) => {
  return (
    <Button
      bg="none"
      _hover={{
        bg: 'bg.dark.350',
      }}
      _focus={{
        boxShadow: 'none',
      }}
      _active={{
        bg: 'bg.dark.300',
      }}
      p="2"
      fontWeight="normal"
      borderRadius="none"
      height="full"
      position="relative"
      onClick={onClick}
      {...buttonProps}
    >
      <Text fontSize="smaller">{children}</Text>
      {active ? (
        <Box
          // border
          position="absolute"
          bottom="0"
          w="full"
          borderBottomWidth="0.15rem"
          borderBottomColor="border.focus.500"
          borderBottomStyle="solid"
        />
      ) : null}
    </Button>
  )
}

export type TabBarProps = StackProps

/**
 * Settings Tab bar
 * @param param0
 * @returns
 */
const TabBar = ({ ...rest }: TabBarProps) => {
  const location = useLocation()
  return (
    <HStack spacing="0" {...rest}>
      <TabButton
        active={location.pathname.endsWith('general')}
        onClick={() => history.push('/app/settings/general')}
      >
        General
      </TabButton>
      <TabButton
        active={location.pathname.endsWith('customization')}
        onClick={() => history.push('/app/settings/customization')}
      >
        Customization
      </TabButton>
    </HStack>
  )
}

export default TabBar
