import React from 'react'
import { Spacer, Centered } from '@react-frontend-developer/react-layout-helpers'
import { HeaderBar, Title, Subtitle,
  Footer, Documentation } from 'components/ui'

import {
  TheGrid, HeaderGridItem, DemoGridItem,
  DocumentationGridItem, FooterGridItem
} from 'components/ui/layout'

import { CogitoAddress } from 'components/cogito-address'

class CogitoId extends React.Component {
  state = {}

  render () {
    return (
      <TheGrid>
        <HeaderGridItem>
          <HeaderBar>
            <Title>Cogito</Title>
            <Subtitle>Identity</Subtitle>
          </HeaderBar>
        </HeaderGridItem>
        <DemoGridItem>
          <Centered>
            <Spacer margin='20px 0 20px 0'>
              <CogitoAddress {...this.props} />
            </Spacer>
          </Centered>
        </DemoGridItem>
        <DocumentationGridItem>
          <Documentation source='documentation/cogito-id.md' />
        </DocumentationGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </TheGrid>
    )
  }
}

export { CogitoId }
