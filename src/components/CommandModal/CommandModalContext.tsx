import { createContext } from 'react'

export type CommandModalContextType = {
  commandModalIsOpen: boolean
  handleCommandModalOpen: () => void
  handleCommandModalClose: () => void
}

export const CommandModalContext = createContext<CommandModalContextType>({
  commandModalIsOpen: false,
  handleCommandModalClose: () => {
    //
  },
  handleCommandModalOpen: () => {
    //
  },
})
