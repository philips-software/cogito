import React from 'react'
import { Text, View } from 'react-native'

export const Input = ({ label, errorMessage, ...args }) => (
  <View {...args}>
    { label && <Text>{ label } </Text> }
    { errorMessage && <Text>{ errorMessage }</Text> }
  </View>
)
