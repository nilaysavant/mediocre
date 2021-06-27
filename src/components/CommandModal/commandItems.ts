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
import { homeDir } from '@tauri-apps/api/path'
import { store } from '../../redux/store'

export type MediocreCommandId =
  | 'get_env'
  | 'my_custom_command'
  | 'open_file'
  | 'save_file_to_path'

export type OnSelectData = {
  commandId: MediocreCommandId
} & (
  | {
      commandId: 'my_custom_command'
      message: string
    }
  | {
      commandId: 'save_file_to_path'
      fileName: string
    }
)

export type MediocreCommand = {
  id: MediocreCommandId
  title: string
  subtitle: string
  icon: IconType
  onSelect?: (data?: OnSelectData) => void
}

export type AllMediocreCommands = {
  list: MediocreCommandId[]
  byId: {
    [key in MediocreCommandId]: MediocreCommand
  }
}

const allMediocreCommands: AllMediocreCommands = {
  list: ['get_env', 'my_custom_command', 'open_file', 'save_file_to_path'],
  byId: {
    get_env: {
      id: 'get_env',
      title: 'Get Environment',
      subtitle: 'Get environmet variables information',
      icon: IoTerminal,
      onSelect: async (_data) => {
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
    my_custom_command: {
      id: 'my_custom_command',
      title: 'My Custom Command',
      subtitle: 'My custom command to test response from Tauri backend',
      icon: GoTerminal,
      onSelect: async (data) => {
        try {
          if (!(data && data.commandId === 'my_custom_command'))
            throw new Error(`data is invalid!`)
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
    open_file: {
      id: 'open_file',
      title: 'Open File',
      subtitle: 'Open file from file system',
      icon: GoFileDirectory,
      onSelect: async (_data) => {
        try {
          if (isTauri()) {
            const res = await open()
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
    save_file_to_path: {
      id: 'save_file_to_path',
      title: 'Save File To Path',
      subtitle: 'Save the file to a path in your file system',
      icon: GoFileDirectory,
      onSelect: async (data) => {
        try {
          if (isTauri()) {
            if (!(data && data.commandId === 'save_file_to_path'))
              throw new Error(`data is invalid!`)
            const res = await open({
              defaultPath: await homeDir(),
              directory: true,
              filters: [
                {
                  name: 'Markdown file filter',
                  extensions: ['md'],
                },
              ],
            })
            console.log(
              '🚀 ~ file: commandItems.ts ~ line 24 ~ onClick: ~ res',
              res
            )
            if (res && !Array.isArray(res) && data.fileName) {
              const fileData = store.getState().markdownParser.rawText
              const invokeRes = await tauri.invoke('save_file_to', {
                savePath: `${res}/${data.fileName}`,
                fileData,
              })
              console.log(
                '🚀 ~ file: commandItems.ts ~ line 119 ~ onSelect: ~ invokeRes',
                invokeRes
              )
            } else
              throw new Error(
                `file path (res) is invalid or fileName is invalid!`
              )
          }
        } catch (error) {
          console.error(error)
        }
      },
    },
  },
}

export default allMediocreCommands
