import React from 'react'
import { render } from 'react-testing-library'
import { TelepathError } from './TelepathError'
import { EventWaiter } from 'test-helpers'

describe('TelepathError', () => {
  const errorDescription = 'error description'
  it('displays provied error description', () => {
    const { getByText } = render(<TelepathError error={errorDescription} />)
    expect(getByText(errorDescription)).toBeInTheDocument()
  })

  it('also accepts error description as a child text node', () => {
    const { getByText } = render(
      <TelepathError>{errorDescription}</TelepathError>
    )
    expect(getByText(errorDescription)).toBeInTheDocument()
  })

  it('does not render anything if no error description has been provided', () => {
    const { container } = render(<TelepathError />)
    expect(container.firstChild).toBeNull()
  })

  it('fades out after provided timeout (default 3000ms)', async () => {
    expect.assertions(2)
    const eventWaiter = new EventWaiter()
    const { container } = render(
      <TelepathError error={errorDescription}
        timeout={1}
        onTimeout={() => eventWaiter.onValueChanged('timeout')}
      />
    )
    expect(await eventWaiter.wait()).toBe('timeout')
    expect(container.firstChild).toBeNull()
  })

  it('fades out after provided timeout (default 3000ms) for error provided as child node', async () => {
    expect.assertions(2)
    const eventWaiter = new EventWaiter()
    const { container } = render(
      <TelepathError timeout={1}
        onTimeout={() => eventWaiter.onValueChanged('timeout')}
      >
        {errorDescription}
      </TelepathError>
    )
    expect(await eventWaiter.wait()).toBe('timeout')
    expect(container.firstChild).toBeNull()
  })

  it('receives proper styling when error description is rendered', () => {
    const { container } = render(
      <TelepathError>{errorDescription}</TelepathError>
    )
    expect(container).toMatchSnapshot()
  })

  it('receives proper styling when error description (child) is rendered', () => {
    const { container } = render(
      <TelepathError error={errorDescription} />
    )
    expect(container).toMatchSnapshot()
  })
})
