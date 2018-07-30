import React from 'react'
import glamorous from 'glamorous'
import { Centered } from '@react-frontend-developer/react-layout-helpers'
import { HeaderBar, Title, Subtitle,
  Footer } from 'components/ui'

import {
  NoMatch404Grid, HeaderGridItem,
  ContentGridItem, FooterGridItem
} from './NoMatch404Grid'

const Big404 = glamorous.p({
  fontSize: '5rem',
  fontWeight: 'bold'
})

const NoMatch404 = () =>
  <NoMatch404Grid>
    <HeaderGridItem>
      <HeaderBar>
        <Title>Cogito</Title>
        <Subtitle>404</Subtitle>
      </HeaderBar>
    </HeaderGridItem>
    <ContentGridItem>
      <Centered>
        <Big404>:(</Big404>
        <p>You reached the end of the Internet. There is no way back...</p>
      </Centered>
    </ContentGridItem>
    <FooterGridItem>
      <Footer />
    </FooterGridItem>
  </NoMatch404Grid>

export { NoMatch404 }
