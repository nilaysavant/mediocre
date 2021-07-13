/**
 * All File System Functions here
 */

import { tauri } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { homeDir } from '@tauri-apps/api/path'
import { IsoDatetime } from '../commonTypes'
import isTauri from '../utils/isTauri'
import path from 'path'

const appDirName =
  process.env.NODE_ENV === 'production' ? '.mediocre' : '.mediocredev'

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
    const invokeRes: {
      status: boolean
      message: string
    } = await tauri.invoke('save_file_to', {
      savePath: `${dirPath}/${fileName}`,
      fileData,
    })
    return invokeRes
  }
}

/**
 * fetch Documents Meta data fom FS
 */
export const fetchDocumentsMetadata = async () => {
  if (isTauri()) {
    const invokeRes: {
      filesMetaInfo: {
        fileName: string
        filePath: string
        fileDir?: string
        fileType?: 'markdown'
        modified?: IsoDatetime
      }[]
    } = await tauri.invoke('fetch_docs_info', {})
    const homeDirPath = await homeDir()
    if (!homeDirPath) throw new Error('Path to home dir invalid!')
    const appRootDirPath = path.join(homeDirPath, appDirName)
    const filesMetaInfo = invokeRes.filesMetaInfo.map((docMeta) => ({
      ...docMeta,
      fileRelativePath: path.relative(appRootDirPath, docMeta.filePath),
    }))
    return filesMetaInfo
  }
}

/**
 * Read document from the specified relative path
 */
export const readDocumentFromRelativePath = async (relativePath: string) => {
  if (isTauri()) {
    const invokeRes: {
      content: string
    } = await tauri.invoke('read_document', { relativePath })
    return invokeRes.content
  }
}

/**
 * Write document to a specified relative path
 */
export const writeDocumentToRelativePath = async (
  relativePath: string,
  content: string
) => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
    } = await tauri.invoke('write_document', { relativePath, content })
    return invokeRes
  }
}

export default null
