import React from 'react'
import { Spacer, Centered } from '@react-frontend-developer/react-layout-helpers'
import { Button } from 'semantic-ui-react'
import { HeaderBar, Title, Subtitle, Wrapper,
  Footer, Dropzone, Documentation } from 'components/ui'
import { FileStreamReader } from 'services/file-reader'

import {
  TheGrid, HeaderGridItem, DemoGridItem,
  DocumentationGridItem, FooterGridItem
} from 'components/ui/layout'

class StreamEncryption extends React.Component {
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
      <TheGrid>
        <HeaderGridItem>
          <HeaderBar>
            <Title>Cogito</Title>
            <Subtitle>Stream Encryption</Subtitle>
          </HeaderBar>
        </HeaderGridItem>
        <DemoGridItem>
          <Centered>
            <Spacer margin='20px 0 20px 0'>
              <Wrapper>
                <Dropzone file={this.state.file} onDrop={this.onFilesAdded} />
              </Wrapper>
            </Spacer>
            <Button secondary onClick={this.read}>
              Read...
            </Button>
          </Centered>
        </DemoGridItem>
        <DocumentationGridItem>
          <Documentation source='documentation/stream-encryption.md' />
        </DocumentationGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </TheGrid>
    )
  }
}

export { StreamEncryption }
