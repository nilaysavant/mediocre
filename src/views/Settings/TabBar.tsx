import { Button, ButtonProps } from '@chakra-ui/button'
import { Box, HStack, StackProps, Text } from '@chakra-ui/layout'
import { ReactNode } from 'react'

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

const TabBar = ({ ...rest }: TabBarProps) => {
  return (
    <HStack spacing="0" {...rest}>
      <TabButton active>General</TabButton>
      <TabButton>Customization</TabButton>
    </HStack>
  )
}

export default TabBar
