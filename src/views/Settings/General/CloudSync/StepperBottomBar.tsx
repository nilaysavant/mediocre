import { Circle, Flex, FlexProps, Stack } from '@chakra-ui/layout'
import SettingsButton from '../../SettingsButton'

export type StepperBottomBarProps = {
  onNext: () => void | Promise<void>
  onBack?: () => void
  nextButtonIsLoading?: boolean
  showStepper?: boolean
  maxSteps?: number
  currentStepIndex?: number
  containerProps?: FlexProps
}

const StepperBottomBar = ({
  onBack,
  onNext,
  nextButtonIsLoading,
  showStepper = true,
  currentStepIndex = 0,
  maxSteps = 1,
  containerProps,
}: StepperBottomBarProps) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      {...containerProps}
    >
      {showStepper ? (
        <Stack direction="row" p="2">
          {Array.from(Array(maxSteps).keys()).map((e, idx) =>
            idx === currentStepIndex ? (
              <Circle key={`stepper-${idx}`} bg="icon.dark.400" size="10px" />
            ) : (
              <Circle key={`stepper-${idx}`} bg="gray.600" size="10px" />
            )
          )}
        </Stack>
      ) : null}
      <Stack direction="row">
        {onBack ? (
          <SettingsButton
            colorScheme="gray"
            onClick={onBack}
            disabled={nextButtonIsLoading || currentStepIndex === 0}
          >
            Back
          </SettingsButton>
        ) : null}
        <SettingsButton
          isLoading={nextButtonIsLoading}
          onClick={onNext}
          disabled={nextButtonIsLoading || currentStepIndex === maxSteps - 1}
        >
          Next
        </SettingsButton>
      </Stack>
    </Flex>
  )
}

export default StepperBottomBar
