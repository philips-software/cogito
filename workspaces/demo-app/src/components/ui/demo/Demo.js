import React from 'react'
import { Spacer, Centered } from '@react-frontend-developer/react-layout-helpers'
import { HeaderBar, Title, Subtitle,
  Footer, Documentation } from 'components/ui'

import {
  TheGrid, HeaderGridItem, DemoGridItem, DemoNavigationGridItem,
  DocumentationGridItem, FooterGridItem
} from 'components/ui/layout'

import { DemoNavigation } from './DemoNavigation'

class Demo extends React.Component {
  state = {}

  render () {
    const { children, title, subtitle, documentation, routeProps } = this.props

    return (
      <TheGrid>
        <HeaderGridItem>
          <HeaderBar>
            <Title>{title || 'Cogito'}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </HeaderBar>
        </HeaderGridItem>
        <DemoGridItem>
          <Centered>
            <Spacer margin='20px 0 20px 0'>
              {children}
            </Spacer>
          </Centered>
        </DemoGridItem>
        <DemoNavigationGridItem>
          <DemoNavigation {...routeProps} />
        </DemoNavigationGridItem>
        <DocumentationGridItem>
          <Documentation source={documentation} />
        </DocumentationGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </TheGrid>
    )
  }
}

export { Demo }
