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
import { GoFileDirectory, GoTerminal } from 'react-icons/go'
import { IoTerminal } from 'react-icons/io5'
import isTauri from '../../utils/isTauri'
import { open } from '@tauri-apps/api/dialog'

export type OnSelectInputSchemaType = {
  message: string
}

export type CommandItem = {
  id: string
  title: string
  subtitle: string
  icon: IconType
  onSelect?: (data?: OnSelectInputSchemaType) => void
}

const commandItems: CommandItem[] = [
  {
    id: 'get_env',
    title: 'Get Environment',
    subtitle: 'Get environmet variables information',
    icon: IoTerminal,
    onSelect: async () => {
      try {
        if (isTauri()) {
          const res = await tauri.invoke('get_env')
          console.log(
            '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
            res
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
  {
    id: 'my_custom_command',
    title: 'My Custom Command',
    subtitle: 'My custom command to test response from Tauri backend',
    icon: GoTerminal,
    onSelect: async (data) => {
      try {
        if (!data) throw new Error(`data is invalid!`)
        if (isTauri()) {
          const res = await tauri.invoke('my_custom_command', {
            message: data.message,
          })
          console.log(
            '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
            res
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
  {
    id: 'open_file',
    title: 'Open File',
    subtitle: 'Open file from file system',
    icon: GoFileDirectory,
    onSelect: async () => {
      try {
        if (isTauri()) {
          const res = open()
          console.log(
            '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
            res
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
]

export default commandItems
