import React from 'react'
import glamorous from 'glamorous'

const Wrapper = glamorous.div({
  display: 'block',
  paddingLeft: '2em',
  paddingRight: '2em',
  margin: '2em auto'
})

const DropzoneText = ({ file }) => (
  <Wrapper>
    {file ? <div>{file.name}</div> : <div>(or drop a file here)</div>}
  </Wrapper>
)

export { DropzoneText }
