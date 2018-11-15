export class CogitoIdentity {
  static Property = {
    Username: 'username',
    EthereumAddress: 'ethereumAddress'
  }
  constructor ({ channel }) {
    this.channel = channel
  }
  getInfo () {
    if (this.channel.error) {
      return Promise.reject(this.channel.error)
    } else {
      return Promise.resolve(this.channel.mockIdentityInfo())
    }
  }
}
