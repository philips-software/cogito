import React from 'react'
import { Spacer, Row } from '@react-frontend-developer/react-layout-helpers'
import { Segment } from 'semantic-ui-react'
import { Status } from 'components/styling'

export const StatusSegmentRow = ({ children }) => {
  return (
    <Spacer margin='10px'>
      <Row>
        <Segment>
          <Status>{children}</Status>
        </Segment>
      </Row>
    </Spacer>
  )
}
