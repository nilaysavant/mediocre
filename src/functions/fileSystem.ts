/**
 * All File System Functions here
 */

import { tauri } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { homeDir } from '@tauri-apps/api/path'
import isTauri from '../utils/isTauri'

/**
 * Open File Selection Dialog Box
 * @param options
 * @returns
 */
export const openFileSelectionDialog = async (options?: {
  directory?: boolean
  multiple?: boolean
  fileTypes?: ('md' | 'txt' | 'png' | 'jpg' | 'svg')[]
}) => {
  const openResult = await open({
    defaultPath: await homeDir(),
    directory: options?.directory ? true : false,
    multiple: options?.multiple ? true : false,
    filters: options?.fileTypes
      ? [
          {
            name: 'Markdown file filter',
            extensions: options?.fileTypes as string[],
          },
        ]
      : undefined,
  })
  return openResult
}

/**
 * Save File to a custom directory path supplied
 */
export const saveFileToCustomPath = async (
  dirPath: string,
  fileName: string,
  fileData: string
) => {
  if (isTauri()) {
    if (!(dirPath && fileName)) throw new Error(`dirPath/fileName invalid!`)
    type InvokeResult = {
      status: boolean
      message: string
    }
    const invokeRes: InvokeResult = await tauri.invoke('save_file_to', {
      savePath: `${dirPath}/${fileName}`,
      fileData,
    })
    return invokeRes
  }
}

export default null
