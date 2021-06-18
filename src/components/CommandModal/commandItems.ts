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
  onSelect?: (data?: any) => void
}

const commandItems: CommandItem[] = [
  {
    id: 'get_env',
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
    id: 'my_custom_command',
    title: 'My Custom Command',
    subtitle: 'My custom command to test response from Tauri backend',
    icon: VscServerEnvironment,
    onSelect: async (data) => {
      const { invokeMessage } = data as { invokeMessage: string }
      if (isTauri()) {
        const res = await tauri.invoke('my_custom_command', { invokeMessage })
        console.log(
          '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
          res
        )
      }
    },
  },
]

export default commandItems
