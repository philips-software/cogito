class CogitoRequest {
  static create (method, params) {
    return {
      jsonrpc: '2.0',
      id: this.nextId(),
      method,
      params
    }
  }

  static nextId () {
    return this.id++
  }
}

CogitoRequest.id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER / 2))

export { CogitoRequest }
