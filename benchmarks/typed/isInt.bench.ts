import * as _ from 'radashi'

describe('isInt', () => {
  bench('with integer', () => {
    _.isInt(22)
  })

  bench('with non-integer', () => {
    _.isInt(22.0567)
  })

  bench('with non-number value', () => {
    _.isInt('abc')
  })
})
