import React from 'react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'
import { StatusSegmentRow } from 'components/ui/layout'

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
              <StatusSegmentRow>{children}</StatusSegmentRow>
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
