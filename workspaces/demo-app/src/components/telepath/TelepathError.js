import React from 'react'
import { TimedStatus } from 'components/utils'
import { StatusSegmentRow } from 'components/ui/layout'

export const TelepathError = ({ error, onTimeout, timeout = 3000 }) => {
  if (!error) {
    return null
  }
  return (
    <TimedStatus timeout={timeout} onTimeout={onTimeout}>
      <StatusSegmentRow>{error}</StatusSegmentRow>
    </TimedStatus>
  )
}
