const td = require('testdouble')
const { SecureChannel } = require('../lib/secure-channel')

describe('secure-channel', function () {
  const channelId = 'channel_id'

  let channel
  let queuing

  beforeEach(function () {
    queuing = td.object()
    channel = new SecureChannel({ queuing, id: channelId })
  })

  it('uses the red queue for sending', function () {
    channel.send()
    td.verify(queuing.send(channelId + '.red'))
  })
})
