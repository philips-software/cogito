import React from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import {
  Row,
  Spacer
} from '@react-frontend-developer/react-layout-helpers'
import { Status } from 'components/styling'
import { Segment } from 'semantic-ui-react'

const TelepathStatus = ({ children }) => {
  return (
    <WithStore selector={state => ({
      telepathInProgress: state.appEvents.telepathInProgress
    })}
    >
      {
        ({ telepathInProgress }) => {
          if (telepathInProgress) {
            return (
              <Spacer margin='10px'>
                <Row>
                  <Segment>
                    <Status>{children}</Status>
                  </Segment>
                </Row>
              </Spacer>
            )
          } else {
            return null
          }
        }
      }
    </WithStore>
  )
}

export { TelepathStatus }
