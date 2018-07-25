import React from 'react'
import glamorous from 'glamorous'
import FontAwesome from 'react-fontawesome'

const Button = glamorous.button({
  display: 'block',
  border: 'none',
  background: 'transparent',
  margin: '2em auto',
  fontSize: 'large',
  ':focus': {
    outline: 0
  }
})

const DropzoneButton = () => (
  <Button onClick={e => e.preventDefault()}>
    <FontAwesome name='plus-circle' />&nbsp;Select file
  </Button>
)

export { DropzoneButton }
