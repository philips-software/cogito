import { PropValidator } from './PropValidator'

describe('PropValidator', () => {
  const propName = 'propName'
  const badKeysError = badKeys => {
    return new Error(
      `Invalid prop ${propName}.
Expects:  instance of Uint8Array or an Array-like object
Received: an object with non-numerical keys: ${badKeys}`
    )
  }

  const badValuesError = badValues => {
    return new Error(
      `Invalid prop ${propName}.
Expects:  instance of Uint8Array or an Array-like object with numerical entries
Received: an Array-like object with non-numerical values: ${badValues}`
    )
  }

  const unexpected = prop => {
    return new Error(
      `Invalid prop ${propName}.
Expects:  instance of Uint8Array or an Array-like object with numerical entries
Received: ${typeof prop}`
    )
  }

  it('does not throw when validated value is undefined', () => {
    const validator = new PropValidator(undefined, propName)
    expect(() => validator.validate()).not.toThrow()
  })

  it('does not throw when validated value is an instance of Uint8Array', () => {
    const propValue = Uint8Array.from([1, 2, 3])
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).not.toThrow()
  })

  it('does not throw when validated value is an Array-like object', () => {
    const propValue = { 0: 1, 1: 2, 2: 3 }
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).not.toThrow()
  })

  it('throws when validated value is not an Array-like object', () => {
    const propValue = { a: 1, 1: 2, 2: 3 }
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(badKeysError(['a']))
  })

  it('throws when validated value is an Array-like object with non-numerical value', () => {
    const propValue = { 0: 1, 1: '2', 2: 3 }
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(badValuesError(['2']))
  })

  it('throws when validated value is an Array-like object with multiple non-numerical values', () => {
    const propValue = { 0: 1, 1: '2', 2: '3' }
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(badValuesError(['2', '3']))
  })

  it('throws when validated value is not an Array-like object with non-numerical value', () => {
    const propValue = { 0: 1, 1: '2', b: 3 }
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(badKeysError(['b']))
  })

  it('throws when validated value is a regular array', () => {
    const propValue = [ 1, 2, 3 ]
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(badKeysError(['length']))
  })

  it('throws when validated value is not an Array-like object with multiple wrong keys', () => {
    const propValue = { a: 1, 1: '2', b: 3 }
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(badKeysError(['a', 'b']))
  })

  it('throws when validated value is not an object', () => {
    const propValue = 'a string'
    const validator = new PropValidator(propValue, propName)
    expect(() => validator.validate()).toThrow(unexpected(propValue))
  })
})
