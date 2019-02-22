import React from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { ConnectorBody } from './ConnectorBody'
import PropTypes from 'prop-types'

const CogitoConnector = ({
  connectUrl,
  telepathChannel,
  buttonStyling,
  buttonDisabled,
  buttonText,
  open,
  onOpen,
  onDone,
  onCancel
}) => (
  <Modal
    open={open}
    trigger={
      <Button {...buttonStyling} disabled={buttonDisabled} onClick={onOpen}>
        {buttonText || 'Show QR code'}
      </Button>
    }
    onClose={onCancel}
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
