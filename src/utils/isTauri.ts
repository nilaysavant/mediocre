/**
 * Detect if running inside Tauri Browser(WRY WebView)
 * equivalent of is-electron https://www.npmjs.com/package/is-electron
 */
const isTauri = () => {
  return window.__TAURI__ ? true : false
}

export default isTauri
