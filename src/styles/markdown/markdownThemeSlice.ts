import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import './markdown.css'
import './clearness/clearness.css'
import './clearness-dark/clearness-dark.css'
import './github/github.css'
import './metro-vibes/metro-vibes.css'
import './metro-vibes-dark/metro-vibes-dark.css'
import './node-dark/node-dark.css'
import './solarized-dark/solarized-dark.css'
import './solarized-light/solarized-light.css'
import './wood/wood.css'
import './wood-ri/wood-ri.css'

export const mdThemes: {
  list: MdThemeTypes[]
  byId: {
    [key in MdThemeTypes]: {
      label: string
    }
  }
} = {
  list: [
    'clearness',
    'clearness-dark',
    'github',
    'github2',
    'haroopad',
    'metro-vibes',
    'metro-vibes-dark',
    'node-dark',
    'solarized-dark',
    'solarized-light',
    'wood',
    'wood-ri',
  ],
  byId: {
    clearness: { label: 'Clearness' },
    'clearness-dark': { label: 'Clearness Dark' },
    github: { label: 'GitHub' },
    github2: { label: 'GitHub2' },
    haroopad: { label: 'Haroopad' },
    'metro-vibes': { label: 'Metro Vibes' },
    'metro-vibes-dark': { label: 'Metro Vibes Dark' },
    'node-dark': { label: 'Node Dark' },
    'solarized-dark': { label: 'Solarized Dark' },
    'solarized-light': { label: 'Solarized Light' },
    wood: { label: 'Wood' },
    'wood-ri': { label: 'Wood Ri' },
  },
}

export type MdThemeTypes =
  | 'clearness'
  | 'clearness-dark'
  | 'github'
  | 'github2'
  | 'haroopad'
  | 'metro-vibes'
  | 'metro-vibes-dark'
  | 'node-dark'
  | 'solarized-dark'
  | 'solarized-light'
  | 'wood'
  | 'wood-ri'

// Define a type for the slice state
interface MarkdownThemeState {
  theme: MdThemeTypes
}

// Define the initial state using that type
const initialState: MarkdownThemeState = {
  theme: 'solarized-dark',
}

export const markdownThemeSlice = createSlice({
  name: 'markdownTheme',
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateTheme: (state, action: PayloadAction<MdThemeTypes>) => {
      state.theme = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateTheme } = markdownThemeSlice.actions

export default markdownThemeSlice.reducer
