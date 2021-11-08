/**
 * ### Async Sleep with delay
 * - `delay`: in millisecond
 */
export const sleep = (delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

export default sleep
