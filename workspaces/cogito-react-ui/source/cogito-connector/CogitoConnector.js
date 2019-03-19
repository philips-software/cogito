import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { ConnectorBody } from './ConnectorBody'
import PropTypes from 'prop-types'

class CogitoConnector extends React.Component {
  subscription

  render () {
    const {
      connectUrl,
      telepathChannel,
      buttonStyling,
      buttonDisabled,
      buttonText,
      open,
      onOpen,
      onDone,
      onCancel
    } = this.props
    return (
      <Modal
        open={open}
        trigger={
          <Button
            {...buttonStyling}
            disabled={buttonDisabled}
            onClick={async () => {
              if (onOpen) {
                await onOpen()
              }
            }}
          >
            {buttonText || 'Show QR code'}
          </Button>
        }
        onClose={() => {
          if (onCancel) {
            onCancel()
          }
        }}
        closeIcon
      >
        <Modal.Header>Scan QRCode</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <ConnectorBody
              connectUrl={connectUrl}
              telepathChannel={telepathChannel}
              buttonStyling={buttonStyling}
              onDone={onDone}
            />
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }
}

CogitoConnector.propTypes = {
  connectUrl: PropTypes.string.isRequired,
  telepathChannel: PropTypes.object.isRequired,
  buttonStyling: PropTypes.object,
  buttonDisabled: PropTypes.bool,
  buttonText: PropTypes.string,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onDone: PropTypes.func,
  onCancel: PropTypes.func
}

export { CogitoConnector }
