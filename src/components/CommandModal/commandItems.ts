import {
  AddIcon,
  ExternalLinkIcon,
  QuestionIcon,
  SearchIcon,
  SettingsIcon,
} from '@chakra-ui/icons'
import { ListItemProps } from '@chakra-ui/react'
import { tauri } from '@tauri-apps/api'
import { IconType } from 'react-icons/lib'
import { VscServerEnvironment } from 'react-icons/vsc'
import isTauri from '../../utils/isTauri'

export type CommandItem = {
  id: string
  title: string
  subtitle: string
  icon: IconType
  onSelect?: () => void
}

const commandItems: CommandItem[] = [
  {
    id: 'GET_ENV',
    title: 'Get Environment',
    subtitle: 'Get environmet variables information',
    icon: VscServerEnvironment,
    onSelect: async () => {
      if (isTauri()) {
        const res = await tauri.invoke('get_env')
        console.log(
          '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
          res
        )
      }
    },
  },
  {
    id: 'GET_ENV_2',
    title: 'Get Environment',
    subtitle: 'Get environmet variables information',
    icon: VscServerEnvironment,
    onSelect: async () => {
      if (isTauri()) {
        const res = await tauri.invoke('get_env')
        console.log(
          '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
          res
        )
      }
    },
  },
]

export default commandItems
