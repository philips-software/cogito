import React from 'react'
import { Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { layout } from './Layout'

export class CreateIdentity extends React.Component {
  static modalPresentationLayout = {
    stack: {
      children: [
        { component: { name: 'CreateIdentity' } }
      ]
    }
  }

  static options () {
    return layout
  }

  constructor (props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  render () {
    return <Text>Create</Text>
  }

  navigationButtonPressed () {
    const { componentId } = this.props
    Navigation.dismissModal(componentId)
  }
}
