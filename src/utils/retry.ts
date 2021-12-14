import sleep from './sleep'

/**
 * Retry Error Class
 */
export class RetryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/**
 * Retry wrapper for calling `fn` for `maxRetries`
 * each after a certain `timeout`
 * @param maxRetries
 * @param fn
 */
const retry = async <T>(
  maxRetries: number,
  fn: () => Promise<T>,
  timeout = 0
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof RetryError) {
        if (timeout) await sleep(timeout)
        continue
      } else {
        console.error(error)
        throw error
      }
    }
  }
  throw new Error(`maxRetries exceeded!`)
}

export default retry
