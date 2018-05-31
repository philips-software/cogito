import uuidv4 from 'uuid/v4'

class CogitoIdentity {
  static Property = {
    Username: 'username',
    EthereumAddress: 'ethereumAddress'
  }

  constructor ({ channel }) {
    this.channel = channel
  }

  async getInfo ({ properties }) {
    const request = this.createRequest('getIdentityInfo', { properties })
    const response = await this.channel.send(request)
    if (response.error) {
      throw new Error(response.error.message)
    } else {
      return response.result
    }
  }

  createRequest (method, params) {
    return {
      jsonrpc: '2.0',
      id: this.newRequestId(),
      method,
      params
    }
  }

  newRequestId () {
    return uuidv4()
  }
}

export { CogitoIdentity }
