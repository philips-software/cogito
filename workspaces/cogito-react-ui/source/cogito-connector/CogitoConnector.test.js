import React from 'react'
import { render, fireEvent } from 'react-testing-library'
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
      queryByText = render(
        <CogitoConnector
          connectUrl='connectUrl'
          telepathChannel={telepathChannel}
        />
      ).queryByText
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
    let getAllByText
    let unmount
    let onDone

    beforeEach(() => {
      onDone = jest.fn()
      const renderUtils = render(
        <CogitoConnector
          open
          connectUrl='connectUrl'
          telepathChannel={telepathChannel}
          onDone={onDone}
        />
      )
      queryByText = renderUtils.queryByText
      getAllByText = renderUtils.getAllByText
      unmount = renderUtils.unmount
    })

    it('does show the dialog when opened', () => {
      expect(queryByText(/scan the qr code/i)).not.toBeNull()
    })

    it('fires onDone when close button is pressed', async () => {
      const buttons = getAllByText(/done/i)
      expect(buttons.length).toBe(2)
      // TODO: why are there TWO 'done' buttons? How do I select the right one?
      buttons.forEach(b => {
        fireEvent.click(b)
      })
      expect(onDone).toHaveBeenCalled()
    })

    it('subscribes for notifications', () => {
      expect(telepathChannel.subscribeForNotifications).toHaveBeenCalled()
    })

    it('unsubscribes un unmount', () => {
      unmount()
      expect(telepathChannel.unsubscribeForNotifications).toHaveBeenCalled()
    })

    it('fires onDone when telepath notification is received', () => {
      const notification = { jsonrpc: '2.0', method: 'didScanQRCode' }
      const onNotification =
        telepathChannel.subscribeForNotifications.mock.calls[0][0]
      onNotification(notification)
      expect(onDone).toHaveBeenCalled()
    })
  })
})
