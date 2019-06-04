import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 3,
    padding: 5
  },
  identityNameTextInput: {
    width: '100%',
    margin: 40,
    textAlign: 'center'
  },
  errorMessageText: {
    color: 'red'
  }
})
