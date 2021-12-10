/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * prepare.js
 * - npm life-cycle hook script
 */

/** check if running in CI */
const isCi = process.env.CI !== undefined
if (!isCi) {
  // Conditionally install husky
  require('husky').install()
}
