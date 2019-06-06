import React from 'react'
import { Text } from 'react-native-elements'

export const Button = ({ title, ...args }) => (
  <Text {...args}>
    { title }
  </Text>
)
