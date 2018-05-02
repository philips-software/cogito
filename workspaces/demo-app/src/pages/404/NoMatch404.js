import React from 'react'
import glamorous from 'glamorous'

import { HomeGrid, HeaderGridItem, AddressesGridItem,
  ContractGridItem, FooterGridItem } from 'pages/home/HomeGrid'

import { Centered, FullWidthCentered } from '@react-frontend-developer/react-layout-helpers'
import { TopBar } from 'components/top-bar'
import { Footer } from 'components/footer'

const Big404 = glamorous.p({
  fontSize: '5rem',
  fontWeight: 'bold'
})

const NoMatch404 = () =>
  <HomeGrid>
    <HeaderGridItem>
      <TopBar />
    </HeaderGridItem>
    <AddressesGridItem>
      <Centered>
        <Big404>:(</Big404>
      </Centered>
    </AddressesGridItem>
    <ContractGridItem>
      <FullWidthCentered>
        <p>You reached the end of the Internet. There is no way back...</p>
      </FullWidthCentered>
    </ContractGridItem>
    <FooterGridItem>
      <Footer />
    </FooterGridItem>
  </HomeGrid>

export { NoMatch404 }
