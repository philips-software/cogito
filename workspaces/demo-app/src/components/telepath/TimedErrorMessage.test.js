import React from 'react'
import { render } from 'react-testing-library'
import { TimedErrorMessage } from './TimedErrorMessage'

describe('TimedErrorMessage', () => {
  const errorDescription = 'error description'

  it('does not render anything if no error description has been provided', () => {
    const { container } = render(<TimedErrorMessage />)
    expect(container.firstChild).toBeNull()
  })

  it('displays provided error description', () => {
    const { getByText } = render(<TimedErrorMessage error={errorDescription} />)
    expect(getByText(errorDescription)).toBeInTheDocument()
  })

  it('also accepts error description as a child text node', () => {
    const { getByText } = render(
      <TimedErrorMessage>{errorDescription}</TimedErrorMessage>
    )
    expect(getByText(errorDescription)).toBeInTheDocument()
  })

  it("doesn't require onTimeout, takes default", () => {
    jest.useFakeTimers()
    const { container, getByText } = render(<TimedErrorMessage timeout={10} error={errorDescription} />)
    expect(getByText(errorDescription)).toBeInTheDocument()

    jest.advanceTimersByTime(10)

    expect(container.firstChild).toBeNull()
  })

  it('calls the onTimeout function when fading', () => {
    jest.useFakeTimers()
    const callback = jest.fn()

    render(
      <TimedErrorMessage error={errorDescription} timeout={10} onTimeout={callback} />
    )

    jest.advanceTimersByTime(10)
    expect(callback).toBeCalled()
  })

  it('fades out after provided timeout (default 3000ms)', () => {
    jest.useFakeTimers()
    const callback = jest.fn()

    const { container, getByText } = render(
      <TimedErrorMessage error={errorDescription}
        onTimeout={callback}
      />
    )
    expect(getByText(errorDescription)).toBeInTheDocument()

    jest.advanceTimersByTime(3000)
    expect(container.firstChild).toBeNull()
    expect(callback).toBeCalled()
  })

  it('receives proper styling when error description is rendered', () => {
    const { container } = render(
      <TimedErrorMessage>{errorDescription}</TimedErrorMessage>
    )
    expect(container).toMatchSnapshot()
  })

  it('receives proper styling when error description (child) is rendered', () => {
    const { container } = render(
      <TimedErrorMessage error={errorDescription} />
    )
    expect(container).toMatchSnapshot()
  })
})
