import React from 'react'
import ReactDropzone from 'react-dropzone'
import glamorous from 'glamorous'
import { DropzoneButton } from './DropzoneButton'
import { DropzoneText } from './DropzoneText'

const StyledReactDropzone = glamorous(ReactDropzone)({
  color: '#333',
  border: '2px dashed #333',
  borderRadius: '5px',
  textAlign: 'center',
  cursor: 'hand'
})

const Dropzone = ({ file, onDrop }) => (
  <StyledReactDropzone onDrop={onDrop}>
    <DropzoneButton />
    <DropzoneText file={file} />
  </StyledReactDropzone>
)

export { Dropzone }
