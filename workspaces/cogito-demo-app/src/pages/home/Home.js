import React from 'react'

import { HomeGrid, HeaderGridItem, AddressesGridItem,
  ContractGridItem, FooterGridItem } from './HomeGrid'

import { TopBar } from 'components/top-bar'
import { CogitoAddress } from 'components/cogito-address'
import { CogitoContract } from 'components/cogito-contract'
import { Footer } from 'components/footer'

class Home extends React.Component {
  render () {
    return (
      <HomeGrid>
        <HeaderGridItem>
          <TopBar />
        </HeaderGridItem>
        <AddressesGridItem>
          <CogitoAddress {...this.props} />
        </AddressesGridItem>
        <ContractGridItem>
          <CogitoContract {...this.props} />
        </ContractGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </HomeGrid>
    )
  }
}

export { Home }
