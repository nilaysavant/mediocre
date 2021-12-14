/**
 * All File System Functions here
 */

import { tauri } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { homeDir } from '@tauri-apps/api/path'
import { RetryError } from 'src/utils/retry'
import { IsoDatetime } from '../commonTypes'
import isTauri from '../utils/isTauri'

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
 * Fetch document meta data from the specified relative file path
 */
export const fetchDocumentMetaData = async (relativePath: string) => {
  if (isTauri()) {
    const invokeRes: {
      fileMetaInfo?: {
        fileName: string
        filePath: string
        fileRelativePath?: string
        fileDir?: string
        fileType?: 'markdown'
        modified?: IsoDatetime
      }
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('fetch_doc_info', { relativePath })
    if (!invokeRes.status)
      throw new Error(`fetchDocumentMetaData failed: ${invokeRes.message}`)
    const homeDirPath = await homeDir()
    if (!homeDirPath) throw new Error('Path to home dir invalid!')
    if (!invokeRes.fileMetaInfo)
      throw new Error(`invokeRes.fileMetaInfo invalid!`)
    const fileMetaInfo = {
      ...invokeRes.fileMetaInfo,
    }
    return fileMetaInfo
  }
}

/**
 * fetch All Documents Meta data fom FS
 */
export const fetchAllDocumentsMetadata = async () => {
  if (isTauri()) {
    const invokeRes: {
      filesMetaInfo?: {
        fileName: string
        filePath: string
        fileRelativePath?: string
        fileDir?: string
        fileType?: 'markdown'
        modified?: IsoDatetime
      }[]
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('fetch_all_docs_info', {})
    if (!invokeRes.status)
      throw new Error(`fetchAllDocumentsMetadata failed: ${invokeRes.message}`)
    const homeDirPath = await homeDir()
    if (!homeDirPath) throw new Error('Path to home dir invalid!')
    if (!invokeRes.filesMetaInfo)
      throw new Error(`invokeRes.filesMetaInfo invalid!`)
    const filesMetaInfo = invokeRes.filesMetaInfo.map((docMeta) => ({
      ...docMeta,
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
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('read_document', { relativePath })
    if (invokeRes.retry) throw new RetryError(invokeRes.message)
    if (!invokeRes.status)
      throw new Error(
        `readDocumentFromRelativePath failed: ${invokeRes.message}`
      )
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
      retry: boolean
      message: string
    } = await tauri.invoke('write_document', { relativePath, content })
    if (!invokeRes.status)
      throw new Error(
        `writeDocumentToRelativePath failed: ${invokeRes.message}`
      )
    return invokeRes
  }
}

/**
 * Remove document on a specified relative path
 */
export const removeDocumentFromRelativePath = async (relativePath: string) => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('remove_document', { relativePath })
    if (!invokeRes.status)
      throw new Error(
        `removeDocumentFromRelativePath failed: ${invokeRes.message}`
      )
    return invokeRes
  }
}

/**
 * Rename document on a specified relative path to `newDocumentName`
 */
export const renameDocumentAtRelativePath = async (
  relativePath: string,
  newDocumentName: string
) => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('rename_document', { relativePath, newDocumentName })
    if (!invokeRes.status)
      throw new Error(
        `renameDocumentAtRelativePath failed: ${invokeRes.message}`
      )
    return invokeRes
  }
}

export default null
