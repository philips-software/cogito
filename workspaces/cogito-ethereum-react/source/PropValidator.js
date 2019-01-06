class PropValidator {
  constructor (prop, propName) {
    this.prop = prop
    this.propName = propName
  }

  throwBadKeysError = badKeys => {
    throw new Error(
      `Invalid prop ${this.propName}.
Expects:  instance of Uint8Array or an Array-like object
Received: an object with non-numerical keys: ${badKeys}`
    )
  }

  throwBadValuesError = badValues => {
    throw new Error(
      `Invalid prop ${this.propName}.
Expects:  instance of Uint8Array or an Array-like object with numerical entries
Received: an Array-like object with non-numerical values: ${badValues}`
    )
  }

  throwUnexpected = () => {
    throw new Error(
      `Invalid prop ${this.propName}.
Expects:  instance of Uint8Array or an Array-like object with numerical entries
Received: ${typeof this.prop}`
    )
  }

  isUint8Array = () => {
    return this.prop instanceof Uint8Array
  }

  checkKeys = () => {
    const badKeys = Object.getOwnPropertyNames(this.prop).filter(k => {
      const number = parseInt(k, 10)
      return isNaN(number)
    })
    if (badKeys.length !== 0) {
      this.throwBadKeysError(badKeys)
    }
  }

  checkValues = () => {
    const badValues = Object.values(this.prop).filter(
      v => typeof v !== 'number'
    )
    if (badValues.length !== 0) {
      this.throwBadValuesError(badValues)
    }
  }

  isArrayLikeObject = () => {
    if (typeof this.prop === 'object') {
      this.checkKeys()
      this.checkValues()
    } else {
      this.throwUnexpected()
    }
  }

  isUndefined = () => {
    return this.prop === undefined
  }

  validate = () => {
    this.isUndefined() || this.isUint8Array() || this.isArrayLikeObject()
  }
}

export { PropValidator }
