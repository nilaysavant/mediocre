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
import {
  fetchDocumentsMetadata,
  openFileSelectionDialog,
  saveFileToCustomPath,
} from '../../functions/fileSystem'
import { getEnvironment } from '../../functions/environment'

export type MediocreCommandId =
  | 'get_env'
  | 'my_custom_command'
  | 'open_file'
  | 'save_file_to_path'
  | 'fetch_docs_info'

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

export type OnSelectResult =
  | void
  | {
      selectedPath: string
      saveResult: any
    }
  | {
      app_dir_path: string
    }

export type MediocreCommand = {
  id: MediocreCommandId
  title: string
  subtitle: string
  icon: IconType
  onSelect?: (data?: OnSelectData) => Promise<OnSelectResult>
}

export type AllMediocreCommands = {
  allIds: MediocreCommandId[]
  byId: {
    [key in MediocreCommandId]: MediocreCommand
  }
}

const allMediocreCommands: AllMediocreCommands = {
  allIds: ['get_env', 'my_custom_command', 'open_file', 'save_file_to_path', 'fetch_docs_info'],
  byId: {
    get_env: {
      id: 'get_env',
      title: 'Get Environment',
      subtitle: 'Get environmet variables information',
      icon: IoTerminal,
      onSelect: async () => {
        const envResult = await getEnvironment()
        return envResult
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
        if (isTauri()) {
          const selectedFilePath = await openFileSelectionDialog({
            fileTypes: ['md'],
          })
          console.log(
            '🚀 ~ file: commandItems.ts ~ line 112 ~ onSelect: ~ selectedFilePath',
            selectedFilePath
          )
        }
      },
    },
    save_file_to_path: {
      id: 'save_file_to_path',
      title: 'Save File To Path',
      subtitle: 'Save the file to a path in your file system',
      icon: GoFileDirectory,
      onSelect: async (data) => {
        if (!(data && data.commandId === 'save_file_to_path'))
          throw new Error(`data is invalid!`)
        const selectedPath = await openFileSelectionDialog({
          directory: true,
          fileTypes: ['md'],
        })
        if (selectedPath && !Array.isArray(selectedPath) && data.fileName) {
          const fileData = store.getState().markdownParser.rawText
          const saveResult = saveFileToCustomPath(
            selectedPath,
            data.fileName,
            fileData
          )
          return { selectedPath, saveResult }
        } else
          throw new Error(`file path (res) is invalid or fileName is invalid!`)
      },
    },
    fetch_docs_info: {
      id: 'fetch_docs_info',
      title: 'Fetch Documents Info',
      subtitle: 'Fetch documents meta data from file system',
      icon: GoFileDirectory,
      onSelect: async (_data) => {
        const res = await fetchDocumentsMetadata()
      },
    },
  },
}

export default allMediocreCommands
