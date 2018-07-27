import React from 'react'
import { Spacer, Centered } from '@react-frontend-developer/react-layout-helpers'
import { HeaderBar, Title, Subtitle,
  Footer, Documentation } from 'components/ui'

import {
  TheGrid, HeaderGridItem, DemoGridItem,
  DocumentationGridItem, FooterGridItem
} from 'components/ui/layout'

import { CogitoContract } from 'components/cogito-contract'

class Contracts extends React.Component {
  state = {}

  render () {
    return (
      <TheGrid>
        <HeaderGridItem>
          <HeaderBar>
            <Title>Cogito</Title>
            <Subtitle>Executing contracts</Subtitle>
          </HeaderBar>
        </HeaderGridItem>
        <DemoGridItem>
          <Centered>
            <Spacer margin='20px 0 20px 0'>
              <CogitoContract {...this.props} />
            </Spacer>
          </Centered>
        </DemoGridItem>
        <DocumentationGridItem>
          <Documentation source='documentation/Contracts.md' />
        </DocumentationGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </TheGrid>
    )
  }
}

export { Contracts }
