import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import styles from '../Styles'

export const KeyboardAvoidingContainer = ({ children }) => (
  // Define different behavior for iOS and Android as specified by:
  // https://facebook.github.io/react-native/docs/keyboardavoidingview#behavior
  <KeyboardAvoidingView
    style={styles.container}
    enabled
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
    { children }
  </KeyboardAvoidingView>
)
