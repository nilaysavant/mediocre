import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface CommandModalState {
  isOpen: boolean
}

// Define the initial state using that type
const initialState: CommandModalState = {
  isOpen: false,
}

export const commandModalSlice = createSlice({
  name: 'commandModal',
  initialState,
  reducers: {
    handleOpen: (state) => {
      state.isOpen = true
    },
    handleClose: (state) => {
      state.isOpen = false
    },
  },
})

// Action creators are generated for each case reducer function
export const { handleOpen, handleClose } = commandModalSlice.actions

export default commandModalSlice.reducer
