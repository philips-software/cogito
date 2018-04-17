import glamorous from 'glamorous'

import { Grid } from 'services/grid'

let grid = new Grid([
  'header',
  'addresses',
  'contract',
  'footer'
], {
  gridTemplateRows: 'max-content max-content auto max-content'
})

const contentBaseStyle = {
  padding: '15px'
}

const HomeGrid = glamorous.div(grid.container, {
  boxSizing: 'border-box',
  height: '100vh'
})

const HeaderGridItem = glamorous.div(grid.header, contentBaseStyle)
const AddressesGridItem = glamorous.div(grid.addresses, contentBaseStyle)
const ContractGridItem = glamorous.div(grid.contract, contentBaseStyle)
const FooterGridItem = glamorous.div(grid.footer, contentBaseStyle)

export { HomeGrid, HeaderGridItem, AddressesGridItem,
  ContractGridItem, FooterGridItem }
