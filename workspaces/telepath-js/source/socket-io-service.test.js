import { SocketIOService } from './socket-io-service'
import base64url from 'base64url'

describe('SocketIOService', () => {
  let socketStub
  let socketIOClient
  let service
  let handlers
  let identifyTimesOut

  beforeEach(() => {
    identifyTimesOut = false
    handlers = []
    socketStub = {
      on: jest.fn().mockImplementation((event, cb) => {
        handlers[event] = cb
      }),
      emit: jest.fn().mockImplementation((event, payload, cb) => {
        if (cb && !identifyTimesOut) {
          setTimeout(() => cb(), 1)
        }
      })
    }
    socketIOClient = {
      connect: jest.fn().mockImplementationOnce(() => {
        setTimeout(() => handlers['connect'](), 1)
        return socketStub
      })
    }
    service = new SocketIOService(socketIOClient)
  })

  it('can be constructed', () => {
    expect(service.socketIOClient).toBe(socketIOClient)
  })

  it('ignores notify because it is not started', () => {
    service.notify(Buffer.from([1, 2, 3]))
    expect(socketStub.emit.mock.calls.length).toBe(0)
  })

  describe('when sending notifications before setup is done', () => {
    beforeEach(() => {
      socketStub.on = jest.fn()
      let data = Buffer.from([1, 2, 3, 4])
      service.notify(data)
    })

    it('records notification as pending and does not send yet', () => {
      expect(service.pendingNotifications.length).toBe(1)
    })
  })

  it('throws when identify times out', async () => {
    identifyTimesOut = true
    await expect(service.start('', () => {}, () => {}, 100)).rejects.toThrow()
  })

  it('sends pending notifications after connection is complete', async () => {
    service.pendingNotifications = [Buffer.from([1, 2, 3, 4])]
    await service.start()
    expect(service.pendingNotifications.length).toBe(0)
    expect(socketStub.emit.mock.calls[1][0]).toBe('notification')
  })

  describe('when started', () => {
    const channelID = 'channelID'
    let notificationSpy
    let errorSpy

    beforeEach(async () => {
      notificationSpy = jest.fn()
      errorSpy = jest.fn()
      await service.start(channelID, notificationSpy, errorSpy)
    })

    it('is correctly configured', () => {
      expect(socketIOClient.connect.mock.calls.length).toBe(1)
      expect(service.socket).toBe(socketStub)
      expect(socketStub.on.mock.calls[1][0]).toBe('notification')
    })

    it('it identifies itself when socket is connected', () => {
      const onConnectCallback = socketStub.on.mock.calls[0][1]
      onConnectCallback()
      expect(socketStub.emit.mock.calls[0][0]).toBe('identify')
      expect(socketStub.emit.mock.calls[0][1]).toBe(channelID)
    })

    describe('when setup is finished', () => {
      beforeEach(() => {
        const onConnectCallback = socketStub.on.mock.calls[0][1]
        onConnectCallback()
        const identifyCallback = socketStub.emit.mock.calls[0][2]
        identifyCallback()
        socketStub.emit.mockReset()
      })

      it('can send notifications', () => {
        let data = Buffer.from([1, 2, 3, 4])
        service.notify(data)
        expect(socketStub.emit.mock.calls[0][0]).toBe('notification')
        const encodedData = base64url.encode(data)
        expect(socketStub.emit.mock.calls[0][1]).toBe(encodedData)
      })

      it('base64url decodes incoming notifications', () => {
        const registeredNotificationHandler = socketStub.on.mock.calls[1][1]
        const message = Buffer.from('a message')
        const encodedMessage = base64url.encode(message)
        registeredNotificationHandler(encodedMessage)
        expect(notificationSpy.mock.calls[0][0]).toEqual(message)
      })

      it('passes errors on', () => {
        const error = 'some error'
        handlers['error'](error)
        expect(errorSpy.mock.calls[0][0]).toBe(error)
      })
    })
  })
})
