import React, { Component } from 'react'
import { Telepath } from '@cogitojs/telepath-js'
import QRCode from 'qrcode.react'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { connectUrl: '', response: '', msgId: 1 }
  }

  async componentDidMount () {
    const telepath = new Telepath('https://telepath.cogito.mobi')
    this.channel = await telepath.createChannel({
      appName: 'Telepath Demo App'
    })
    await this.channel.startNotifications(notification => {
      console.debug('incoming notification: ', notification)
    })
    const connectUrl = this.channel.createConnectUrl('telepath-demo-app://')
    this.setState({ connectUrl })
  }

  async sendMessage () {
    console.debug('Send message')
    const request = {
      jsonrpc: '2.0',
      method: 'Hi! JS here!',
      id: this.state.msgId
    }
    const response = await this.channel.send(request)
    console.debug('Received response: ', response)
    this.setState({ response: response.result, msgId: this.state.msgId + 1 })
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          {this.state.response
            ? <p>{this.state.response}</p>
            : this.renderQRCode()}
        </header>
      </div>
    )
  }

  renderQRCode () {
    return (
      <div>
        <p>
          Scan this code using the iOS camera and use it to open
          the demo app on iOS:
        </p>
        <QRCode value={this.state.connectUrl} /><br /><br />
        <button onClick={() => this.sendMessage()}>
          I scanned the code; say hi!
        </button>
      </div>
    )
  }
}

export default App
