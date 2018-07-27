import React from 'react'
import { Spacer, Centered, FullWidth } from '@react-frontend-developer/react-layout-helpers'
import { HeaderBar, Title, Subtitle,
  Footer, Documentation } from 'components/ui'

import {
  TheGrid, HeaderGridItem, DemoGridItem,
  DocumentationGridItem, FooterGridItem
} from 'components/ui/layout'

import { CogitoAttestations } from 'components/cogito-attestations'

class Attestations extends React.Component {
  state = {}

  render () {
    return (
      <TheGrid>
        <HeaderGridItem>
          <HeaderBar>
            <Title>Cogito</Title>
            <Subtitle>Attestations</Subtitle>
          </HeaderBar>
        </HeaderGridItem>
        <DemoGridItem>
          <Centered>
            <FullWidth>
              <Spacer margin='20px 0 20px 0'>
                <CogitoAttestations {...this.props} />
              </Spacer>
            </FullWidth>
          </Centered>
        </DemoGridItem>
        <DocumentationGridItem>
          <Documentation source='documentation/attestations.md' />
        </DocumentationGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </TheGrid>
    )
  }
}

export { Attestations }
