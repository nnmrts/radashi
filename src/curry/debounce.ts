declare const setTimeout: (fn: () => void, ms: number) => unknown
declare const clearTimeout: (timer: unknown) => void

export interface DebounceFunction<TArgs extends any[] = any> {
  (...args: TArgs): void
  /**
   * Cancels the debounced function
   */
  cancel(): void
  /**
   * Checks if there is any invocation debounced
   */
  isPending(): boolean
  /**
   * Runs the debounced function immediately
   */
  flush(...args: TArgs): void
}

/**
 * Given a delay and a function returns a new function that will only
 * call the source function after delay milliseconds have passed
 * without any invocations.
 *
 * Debounced functions have these methods:
 *
 * - The `cancel` method cancels the debounced function.
 * - The `flush` method calls the underlying function immediately.
 * - The `isPending` method checks if the debounced function is pending.
 *
 * @see https://radashi-org.github.io/reference/curry/debounce
 * @example
 * ```ts
 * const myDebouncedFunc = debounce({ delay: 1000 }, (x) => console.log(x))
 *
 * myDebouncedFunc(0)
 * myDebouncedFunc(1)
 * // Logs 1, but not 0
 * ```
 */
export function debounce<TArgs extends any[]>(
  { delay }: { delay: number },
  handler: (...args: TArgs) => void,
): DebounceFunction<TArgs> {
  let timeout: unknown

  const debounced = ((...args: TArgs) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = undefined
      handler(...args)
    }, delay)
  }) as DebounceFunction<TArgs> & { handler: typeof handler }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = undefined
  }

  debounced.flush = (...args: TArgs) => handler(...args)
  debounced.isPending = () => timeout !== undefined

  return debounced
}
