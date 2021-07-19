import { Button, ButtonProps } from '@chakra-ui/react'

export type AlertButtonProps = {
  buttonRef?: React.MutableRefObject<HTMLButtonElement | null>
} & ButtonProps

const AlertButton = ({ buttonRef, ...rest }: AlertButtonProps) => {
  return (
    <Button
      ref={buttonRef}
      size="sm"
      borderRadius="0"
      fontSize="small"
      fontWeight="normal"
      borderWidth="thin"
      borderColor="transparent"
      _focus={{
        boxShadow: 'none',
        borderColor: 'border.focus.500',
      }}
      {...rest}
    />
  )
}

export default AlertButton
