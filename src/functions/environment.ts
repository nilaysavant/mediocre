/**
 * All Environment Related Functions
 */

import { tauri } from "@tauri-apps/api"
import isTauri from "../utils/isTauri"

/**
 * Get Environment variables from Tauri WIP
 */
export const getEnvironment = async () => {
  if (isTauri()) {
    const invokeResult: {
      app_dir_path: string
    } = await tauri.invoke('get_env')
    return invokeResult
  }
}

export default null
