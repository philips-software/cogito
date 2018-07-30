import React from 'react'
import { Button } from 'semantic-ui-react'
import { Wrapper, Dropzone } from 'components/ui'
import { Spacer, Centered } from '@react-frontend-developer/react-layout-helpers'
import { FileStreamReader } from 'services/file-reader'

class CogitoStreamEncryption extends React.Component {
  state = {}
  onFilesAdded = files => {
    console.log('file:', files[0])
    this.setState({ file: files[0] })
  }

  dataChunkReceived = dataChunk => {
    console.log('Received Data Chunk:', dataChunk)
  }

  read = () => {
    if (this.state.file) {
      const reader = new FileStreamReader({
        file: this.state.file,
        callback: this.dataChunkReceived
      })

      reader.read()
    }
  }

  render () {
    return (
      <Centered>
        <Wrapper>
          <Dropzone file={this.state.file} onDrop={this.onFilesAdded} />
        </Wrapper>
        <Spacer margin='20px 0 20px 0'>
          <Button secondary onClick={this.read}>
            Read...
          </Button>
        </Spacer>
      </Centered>
    )
  }
}

export { CogitoStreamEncryption }
