class TelepathChannelMock {
  firstChannelUrl = 'https://telepath.connect.url/channel1'
  defaultChannelUrl = 'https://telepath.connect.url/channel2'
  identities = [
    {
      ethereumAddress: '0xabcd',
      username: 'Test User'
    },
    {
      ethereumAddress: '0x1234',
      username: 'Another Test User'
    }
  ]
  createConnectUrl = jest.fn(() => this.defaultChannelUrl)
    .mockReturnValueOnce(this.firstChannelUrl)
  mockIdentityInfo = jest.fn()
  constructor ({ identities, createConnectUrl, error } = {}) {
    if (identities) {
      this.identities = identities
    }
    if (createConnectUrl) {
      this.createConnectUrl = createConnectUrl
    }
    if (error) {
      this.error = error
    }
    this.identities.forEach(identity => {
      this.mockIdentityInfo.mockReturnValueOnce(identity)
    })
  }
}

export { TelepathChannelMock }
