class TestingRenderProps {
  function
  args

  setupRenderPropFunction = () => {
    this.args = {}
    this.function = jest.fn().mockImplementation(args => {
      Object.assign(this.args, args)
      return null
    })
  }

  reset = () => {
    this.args = {}
    this.function.mockClear()
  }

  constructor () {
    this.setupRenderPropFunction()
  }
}

export { TestingRenderProps }
