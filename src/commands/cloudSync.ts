import { tauri } from '@tauri-apps/api'
import isTauri from 'src/utils/isTauri'
import { RetryError } from 'src/utils/retry'

/**
 * ### Test Git Clone SSH (Tauri Command)
 *
 * Tauri command to Test git clone via ssh.
 */
export const testGitCloneSSH = async () => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
      message: string
    } = await tauri.invoke('test_git_clone_ssh', {})
    return invokeRes
  }
}

/**
 * ### Store Git repository SSH URL
 *
 * Tauri command to store git repo url(ssh), for sync.
 */
export const setupGitCloudSync = async (
  gitSyncRepoUrl: string,
  gitSyncUserName: string,
  gitSyncUserEmail: string
) => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('setup_git_cloud_sync', {
      gitSyncRepoUrl,
      gitSyncUserName,
      gitSyncUserEmail,
    })
    if (invokeRes.retry) throw new RetryError(invokeRes.message)
    if (!invokeRes.status)
      throw new Error(`setupGitCloudSync failed: ${invokeRes.message}`)
    return invokeRes
  }
}

/**
 * ### Sync to Git Cloud
 *
 * Tauri command to normally sync to git cloud.
 */
export const syncToGitCloud = async () => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
      retry: boolean
      message: string
    } = await tauri.invoke('sync_to_git_cloud', {})
    if (invokeRes.retry) throw new RetryError(invokeRes.message)
    if (!invokeRes.status)
      throw new Error(`syncToGitCloud failed: ${invokeRes.message}`)
    return invokeRes
  }
}
