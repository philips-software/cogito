import React from 'react'
import { render } from 'test-helpers/render-props'
import { AppEventsActions } from 'app-events'
import { TelepathStatus } from './TelepathStatus'

jest.unmock('@react-frontend-developer/react-redux-render-prop')

describe('TelepathStatus', () => {
  const status = 'Status Message'

  it('shows status message when telepath opertion is in progress', () => {
    const { getByText, store: { dispatch } } = render(
      <TelepathStatus>{status}</TelepathStatus>
    )
    dispatch(AppEventsActions.telepathInProgress())
    expect(getByText(`${status}`)).toBeInTheDocument()
  })

  it('does not show anything if telepath operation is not in progress', () => {
    const { queryByText } = render(<TelepathStatus>{status}</TelepathStatus>)

    expect(queryByText(`${status}`)).toBeNull()
  })

  it('has correct styling when visble', () => {
    const { container, store: { dispatch } } = render(
      <TelepathStatus>{status}</TelepathStatus>
    )

    dispatch(AppEventsActions.telepathInProgress())

    expect(container).toMatchSnapshot()
  })

  it('renders nothing when not visible', () => {
    const { container } = render(
      <TelepathStatus>{status}</TelepathStatus>
    )

    expect(container).toMatchSnapshot()
  })
})
