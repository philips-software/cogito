import React from 'react'
import { Text, View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import styles from './Styles'

export const Home = ({ componentId }) => (
  <View style={styles.container}>
    <Text onPress={() => openIdentityManager({ componentId })}>
      I am.
    </Text>
  </View>
)

const openIdentityManager = ({ componentId }) => {
  Navigation.push(componentId, {
    component: { 
      name: 'IdentityManager',
      options: {
        topBar: { title: { text: 'Me, Myself and I' } }
      }
    }
  })
}
