import React from 'react'
import { Spacer, Centered } from '@react-frontend-developer/react-layout-helpers'
import { HeaderBar, Title, Subtitle,
  Footer, Documentation } from 'components/ui'

import {
  TheGrid, HeaderGridItem, DemoGridItem,
  DocumentationGridItem, FooterGridItem
} from 'components/ui/layout'

import { CogitoSimpleEncryption } from 'components/cogito-crypto'

class SimpleEncryption extends React.Component {
  state = {}

  render () {
    return (
      <TheGrid>
        <HeaderGridItem>
          <HeaderBar>
            <Title>Cogito</Title>
            <Subtitle>Simple Encryption</Subtitle>
          </HeaderBar>
        </HeaderGridItem>
        <DemoGridItem>
          <Centered>
            <Spacer margin='20px 0 20px 0'>
              <CogitoSimpleEncryption {...this.props} />
            </Spacer>
          </Centered>
        </DemoGridItem>
        <DocumentationGridItem>
          <Documentation source='documentation/simple-encryption.md' />
        </DocumentationGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </TheGrid>
    )
  }
}

export { SimpleEncryption }
