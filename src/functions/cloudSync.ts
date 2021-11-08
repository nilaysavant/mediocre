import { tauri } from '@tauri-apps/api'
import isTauri from 'src/utils/isTauri'

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
export const storeGitRepositoryUrl = async (gitSyncRepoUrl: string) => {
  if (isTauri()) {
    const invokeRes: {
      status: boolean
      message: string
    } = await tauri.invoke('store_git_repository_url', { gitSyncRepoUrl })
    return invokeRes
  }
}
