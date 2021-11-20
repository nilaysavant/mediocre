import React from 'react'

const CloudSyncStepperContext = React.createContext<{
  currentStep: number
  maxSteps: number
  onNext: () => void
  onBack: () => void
  onClose: () => void
}>({
  currentStep: 0,
  maxSteps: 1,
  onNext: () => {
    return
  },
  onBack: () => {
    return
  },
  onClose: () => {
    return
  },
})

export default CloudSyncStepperContext
