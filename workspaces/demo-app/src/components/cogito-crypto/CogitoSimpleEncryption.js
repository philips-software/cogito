import React from 'react'
import { Centered } from '@react-frontend-developer/react-layout-helpers'
import { Button, TextArea } from 'semantic-ui-react'
import {
  EncryptionGrid, PlainTextGridItem, CipherTextGridItem,
  EncryptGridItem, DecryptGridItem
} from './EncryptionGrid'
import { StatusSegmentRow } from 'components/ui/layout'
import { EncryptionActions } from 'encryption-state'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'

const CogitoSimpleEncryption = ({ telepathChannel }) => (
  <WithStore selector={state => state.encryption}>
    {
      ({ plainText, cipherText, errorMessage }, dispatch) => (
        <CogitoSimpleEncryptionView
          telepathChannel={telepathChannel}
          plainText={plainText}
          cipherText={cipherText}
          errorMessage={errorMessage}
          dispatch={dispatch}
        />
      )
    }
  </WithStore>
)

const CogitoSimpleEncryptionView = ({ telepathChannel, plainText, cipherText, dispatch, errorMessage }) => (
  <Centered>
    <EncryptionGrid>
      <PlainTextGridItem>
        <TextInput
          data-testid='plain-text'
          placeholder='Enter some text'
          value={plainText}
          onChange={(event) => dispatch(
            EncryptionActions.setPlainText(event.target.value)
          )}
        />
      </PlainTextGridItem>
      <EncryptGridItem>
        <Button
          secondary color='black'
          onClick={() => dispatch(
            EncryptionActions.encrypt({
              telepathChannel: telepathChannel
            })
          )}
        >
          ―Encrypt→
        </Button>
      </EncryptGridItem>
      <DecryptGridItem>
        <Button
          secondary color='black'
          onClick={() => dispatch(
            EncryptionActions.decrypt({
              telepathChannel: telepathChannel
            })
          )}
        >
         ←Decrypt―
        </Button>
      </DecryptGridItem>
      <CipherTextGridItem>
        <TextInput
          data-testid='cipher-text'
          placeholder='Encrypted text appears here'
          value={cipherText}
          onChange={(event) => dispatch(
            EncryptionActions.setCipherText(event.target.value)
          )}
        />
      </CipherTextGridItem>
    </EncryptionGrid>
    <ErrorMessage message={errorMessage} />
  </Centered>
)

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null
  }

  return (
    <div data-testid='error-message'>
      <StatusSegmentRow>{message}</StatusSegmentRow>
    </div>
  )
}

const TextInput = ({ ...args }) => (
  <TextArea {...args} style={{ width: '13rem', height: '10rem' }} />
)

export { CogitoSimpleEncryption, CogitoSimpleEncryptionView }
