import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import { EncryptionActions } from 'encryption-state'
import { CogitoSimpleEncryptionView } from './CogitoSimpleEncryption'

describe('encryption', () => {
  const telepathChannel = 'Some telepath Channel'
  let original, dispatch

  beforeEach(() => {
    dispatch = jest.fn()
    original = EncryptionActions.encrypt

    EncryptionActions.encrypt = jest.fn(
      ({ telepathChannel }) => ({ type: 'ENCRYPT', telepathChannel })
    )
  })

  afterEach(() => {
    EncryptionActions.encrypt = original
  })

  it('calls the encrypt action', () => {
    const { getByText } = render(
      <CogitoSimpleEncryptionView dispatch={dispatch} telepathChannel={telepathChannel} />
    )
    fireEvent.click(getByText('―Encrypt→'))

    expect(dispatch).toBeCalledWith(EncryptionActions.encrypt({ telepathChannel }))
  })

  it('show an error message when encryption fails', () => {
    const errorMessage = 'This is an error message'

    const { getByText } = render(
      <CogitoSimpleEncryptionView dispatch={dispatch} telepathChannel={telepathChannel} errorMessage={errorMessage} />
    )

    expect(getByText(errorMessage)).not.toBeNull()
  })
})
