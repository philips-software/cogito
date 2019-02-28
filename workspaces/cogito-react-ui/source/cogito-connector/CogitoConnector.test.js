import React from 'react'
import { render, fireEvent, waitForElement } from 'react-testing-library'
import { CogitoConnector } from './CogitoConnector'

describe('Cogito Connector', () => {
  let telepathChannel

  beforeEach(() => {
    telepathChannel = {
      subscribeForNotifications: jest.fn(),
      unsubscribeForNotifications: jest.fn()
    }
  })

  describe('when closed', () => {
    let queryByText

    beforeEach(() => {
      const renderUtils = render(
        <CogitoConnector
          connectUrl='connectUrl'
          telepathChannel={telepathChannel}
        />
      )
      queryByText = renderUtils.queryByText
    })

    it('does not show the dialog', () => {
      expect(queryByText(/scan the qr code/i)).toBeNull()
    })

    it('does not subscribe', () => {
      expect(telepathChannel.subscribeForNotifications).not.toHaveBeenCalled()
    })
  })

  describe('when open', () => {
    let queryByText
    let getByText
    let container
    let onDone

    beforeEach(async () => {
      onDone = jest.fn()
      const renderUtils = render(
        <CogitoConnector
          connectUrl='connectUrl'
          telepathChannel={telepathChannel}
          onDone={onDone}
        />
      )
      queryByText = renderUtils.queryByText
      getByText = renderUtils.getByText
      container = renderUtils.container

      fireEvent.click(getByText(/show qr code/i))
      await waitForElement(() => getByText(/done/i))
    })

    it('does show the dialog when opened', () => {
      expect(queryByText(/scan the qr code/i)).not.toBeNull()
    })

    it('fires onDone when close button is pressed', async () => {
      const button = getByText(/done/i)
      fireEvent.click(button)
      expect(onDone).toHaveBeenCalled()
    })

    it('subscribes for notifications', async () => {
      expect(telepathChannel.subscribeForNotifications).toHaveBeenCalled()
    })

    it('unsubscribes on unmount', () => {
      fireEvent.keyDown(container, { key: 'Escape', code: 27 })
      expect(telepathChannel.unsubscribeForNotifications).toHaveBeenCalled()
    })

    describe('when telepath notification is received', () => {
      beforeEach(() => {
        const notification = { jsonrpc: '2.0', method: 'didScanQRCode' }
        const onNotification =
          telepathChannel.subscribeForNotifications.mock.calls[0][0]
        onNotification(notification)
      })

      it('fires onDone when telepath notification is received', () => {
        expect(onDone).toHaveBeenCalled()
      })

      it('unsubscribes from notifications', () => {
        expect(telepathChannel.unsubscribeForNotifications).toHaveBeenCalled()
      })
    })
  })
})
