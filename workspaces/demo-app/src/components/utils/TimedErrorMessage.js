import React from 'react'
import { TimedStatus } from 'components/utils'
import { StatusSegmentRow } from 'components/ui/layout'

export const TimedErrorMessage = ({ children, error, onTimeout = () => {}, timeout = 3000 }) => {
  if (!error && !children) {
    return null
  }
  return (
    <TimedStatus timeout={timeout} onTimeout={onTimeout}>
      <div data-testid='error-message'>
        <StatusSegmentRow>{error || children}</StatusSegmentRow>
      </div>
    </TimedStatus>
  )
}
