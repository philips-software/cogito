import React from 'react'
import { Centered } from '@react-frontend-developer/react-layout-helpers'
import { Button, TextArea } from 'semantic-ui-react'
import {
  EncryptionGrid, PlainTextGridItem, CipherTextGridItem,
  EncryptGridItem, DecryptGridItem
} from './EncryptionGrid'
import { EncryptionActions } from 'encryption-state'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'

const CogitoSimpleEncryption = ({ telepathChannel }) => (
  <WithStore selector={state => state.encryption}>
    {
      ({ plainText, cipherText }, dispatch) => (
        <CogitoSimpleEncryptionView
          telepathChannel={telepathChannel}
          plainText={plainText}
          cipherText={cipherText}
          dispatch={dispatch}
        />
      )
    }
  </WithStore>
)

const CogitoSimpleEncryptionView = ({ telepathChannel, plainText, cipherText, dispatch }) => (
  <Centered>
    <EncryptionGrid>
      <PlainTextGridItem>
        <TextInput
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
          placeholder='Encrypted text appears here'
          value={cipherText}
          onChange={(event) => dispatch(
            EncryptionActions.setCipherText(event.target.value)
          )}
        />
      </CipherTextGridItem>
    </EncryptionGrid>
  </Centered>
)

const TextInput = ({ ...args }) => (
  <TextArea {...args} style={{ width: '13rem', height: '10rem' }} />
)

export { CogitoSimpleEncryption, CogitoSimpleEncryptionView }
