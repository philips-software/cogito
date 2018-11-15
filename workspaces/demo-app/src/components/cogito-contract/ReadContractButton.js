import React from 'react'
import { Button } from 'semantic-ui-react'
import { WithStore } from '@react-frontend-developer/react-redux-render-prop'

const ReadContractButton = ({ onClick }) => {
  return (
    <WithStore selector={state => ({
      telepathInProgress: state.appEvents.telepathInProgress
    })}
    >
      {
        ({ telepathInProgress }) => (
          <Button
            secondary
            color='black'
            disabled={telepathInProgress}
            onClick={(e) => onClick(e)}
          >
          Read...
          </Button>
        )
      }
    </WithStore>
  )
}

export { ReadContractButton }
