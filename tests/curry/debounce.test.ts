import type { DebounceFunction } from 'radashi'
import * as _ from 'radashi'

describe('debounce', () => {
  let func: DebounceFunction<any>
  const mockFunc = vi.fn()
  const runFunc3Times = () => {
    func()
    func()
    func()
  }
  const delay = 600

  beforeEach(() => {
    vi.useFakeTimers()
    func = _.debounce({ delay }, mockFunc)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('only executes once when called rapidly', () => {
    runFunc3Times()
    expect(mockFunc).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(delay + 10)
    expect(mockFunc).toHaveBeenCalledTimes(1)
  })
  test('cancel prevents the debounced function from being called', () => {
    runFunc3Times()
    expect(mockFunc).toHaveBeenCalledTimes(0)
    func.cancel()
    vi.advanceTimersByTime(delay + 10)
    expect(mockFunc).toHaveBeenCalledTimes(0)

    // Verify that new calls after cancel are debounced normally
    runFunc3Times()
    expect(mockFunc).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(delay + 10)
    expect(mockFunc).toHaveBeenCalledTimes(1)
  })

  test('executes the function immediately when the flush method is called', () => {
    func.flush()
    expect(mockFunc).toHaveBeenCalledTimes(1)
  })

  test('continues to debounce after flush is called', () => {
    runFunc3Times()
    expect(mockFunc).toHaveBeenCalledTimes(0)
    func.flush()
    expect(mockFunc).toHaveBeenCalledTimes(1)
    func()
    expect(mockFunc).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(delay + 10)
    expect(mockFunc).toHaveBeenCalledTimes(2)
    func.flush()
    expect(mockFunc).toHaveBeenCalledTimes(3)
  })
})
