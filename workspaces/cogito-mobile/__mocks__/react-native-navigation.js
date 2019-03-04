export const Navigation = {
  push: jest.fn(),
  showModal: jest.fn(),
  events: () => events
}

const bindComponent = jest.fn()
const events = {
  bindComponent,
  get boundComponents () {
    return bindComponent.mock.calls.map(call => call[0])
  }
}
