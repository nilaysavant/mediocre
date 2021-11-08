import React from 'react'

const CloudSyncStepperContext = React.createContext<{
  currentStep: number
  maxSteps: number
  onNext: () => void
  onBack: () => void
}>({
  currentStep: 0,
  maxSteps: 1,
  onNext: () => {
    return
  },
  onBack: () => {
    return
  },
})

export default CloudSyncStepperContext
