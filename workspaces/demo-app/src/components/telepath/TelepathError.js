import React from 'react'
import { TimedStatus } from 'components/utils'
import { StatusSegmentRow } from 'components/ui/layout'

export const TelepathError = ({ children, error, onTimeout, timeout = 3000 }) => {
  if (!error && !children) {
    return null
  }
  return (
    <TimedStatus timeout={timeout} onTimeout={onTimeout}>
      <StatusSegmentRow>{error || children}</StatusSegmentRow>
    </TimedStatus>
  )
}
