import React, { createContext} from 'react'
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

const mdThemes = [
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
]

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

export type MdThemeContextType = {
  theme: MdThemeTypes
  setMdTheme: (theme: MdThemeTypes) => void
}

export const MdThemeContext = createContext<MdThemeContextType>({
  theme: 'solarized-dark',
  setMdTheme: (theme) => {
    return {}
  },
})

export default mdThemes
