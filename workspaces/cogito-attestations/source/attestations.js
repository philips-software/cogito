export class CogitoAttestations {
  constructor ({ telepathChannel }) {
    this.telepathChannel = telepathChannel
    this.requestId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2))
  }

  async retrieve ({ type }) {
    const request = {
      jsonrpc: '2.0',
      id: this.nextRequestId(),
      method: 'attestations',
      params: { type }
    }
    const response = await this.telepathChannel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    }
    return response.result
  }

  nextRequestId () {
    return this.requestId++
  }
}
