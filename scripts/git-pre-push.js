/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * # Pre-Push Git lifecycle hook script
 */

/** require simple git instance */
const path = require('path')
const simpleGit = require('simple-git')
const packageJson = require('../package.json')

/**
 * Init git instance
 * @type {import('simple-git').SimpleGit}
 */
const git = simpleGit()

const checkOnReleaseBranch = async () => {
  const branches = await git.branch()
  return branches.current === 'release'
}

/**
 * Check if version is updated in `package.json`
 */
const checkPackageVersionUpdated = async () => {
  /** fetch all changes with tags */
  await git.fetch({ '--all': null, '--tags': null })
  /** All tags object */
  const tags = await git.tags()
  /** construct current release tag name */
  const currentReleaseTagName = `app-v${packageJson.version}`
  /** if tag is already presentm then we know that the version is not updated */
  if (tags.all.includes(currentReleaseTagName))
    throw new Error(
      `Current Release tag name is already present! Please update version in "package.json", "cargo.toml" and "tauri.conf.json"`
    )
}

/**
 * Asset versions among all config files
 */
const assertVersions = async () => {
  const tauriConfig = require('../src-tauri/tauri.conf.json')
  const toml = require('toml')
  const fs = require('fs/promises')
  if (packageJson.version !== tauriConfig.package.version)
    throw new Error(`packageJson.version !== tauriConfig.package.version`)
  /**
   * @type {{
   *  package: {
   *    version: string,
   *  },
   *  [key: string]: any,
   * }}
   */
  const cargoToml = toml.parse(
    await fs.readFile(path.join(__dirname, '../src-tauri/Cargo.toml'))
  )
  if (packageJson.version !== cargoToml?.package?.version)
    throw new Error(`packageJson.version !== cargoToml?.package?.version`)
}

/**
 * Main function
 */
const main = async () => {
  try {
    if (!(await checkOnReleaseBranch())) return // skip if not pushing on release branch
    await checkPackageVersionUpdated()
    await assertVersions()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

// run main
main()
