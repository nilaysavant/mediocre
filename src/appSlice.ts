import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface AppState {
  id: string
}

// Define the initial state using that type
const initialState: AppState = {
  id: '',
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateId } = appSlice.actions

export default appSlice.reducer
