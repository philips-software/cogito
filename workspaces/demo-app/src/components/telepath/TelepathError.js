import React from 'react'
import { Spacer, Row } from '@react-frontend-developer/react-layout-helpers'
import { Segment } from 'semantic-ui-react'
import { Status } from 'components/styling'
import { TimedStatus } from 'components/utils'

export const TelepathError = ({ error, onTimeout, timeout = 3000 }) => {
  if (!error) {
    return null
  }
  return (
    <TimedStatus timeout={timeout} onTimeout={onTimeout}>
      <Spacer margin='10px'>
        <Row>
          <Segment>
            <Status>{error}</Status>
          </Segment>
        </Row>
      </Spacer>
    </TimedStatus>
  )
}
