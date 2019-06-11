import React from 'react'
import { Text } from 'react-native'

export const Button = ({ title, ...args }) => (
  <Text {...args}>
    { title }
  </Text>
)
