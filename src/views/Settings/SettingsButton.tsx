import { Button, ButtonProps } from '@chakra-ui/button'

export type SettingsButtonProps = {
  buttonRef?: React.MutableRefObject<HTMLButtonElement>
} & ButtonProps

/**
 * ### Customized Chakra button
 * A customized, reusable and themed button component that wraps the Chakra button.
 */
const SettingsButton = ({ buttonRef, ...rest }: SettingsButtonProps) => {
  return (
    <Button
      ref={buttonRef}
      iconSpacing="1"
      borderRadius="sm"
      fontWeight="normal"
      size="sm"
      colorScheme="telegram"
      p="1.5"
      height="auto"
      {...rest}
    />
  )
}

export default SettingsButton
