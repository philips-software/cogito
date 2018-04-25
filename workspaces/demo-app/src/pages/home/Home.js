import React from 'react'

import { HomeGrid, HeaderGridItem, AddressesGridItem,
  ContractGridItem, EncryptionGridItem, FooterGridItem } from './HomeGrid'

import { TopBar } from 'components/top-bar'
import { CogitoAddress } from 'components/cogito-address'
import { CogitoContract } from 'components/cogito-contract'
import { CogitoCrypto } from 'components/cogito-crypto'
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
        <EncryptionGridItem>
          <CogitoCrypto {...this.props} />
        </EncryptionGridItem>
        <FooterGridItem>
          <Footer />
        </FooterGridItem>
      </HomeGrid>
    )
  }
}

export { Home }
