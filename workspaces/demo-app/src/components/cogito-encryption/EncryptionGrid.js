import glamorous from 'glamorous'
import { Grid } from '@react-frontend-developer/css-grid-helper'

let grid = new Grid([
  'plainText encrypt cipherText',
  'plainText decrypt cipherText'
])

const gridItemStyle = {
  textAlign: 'center'
}

const EncryptionGrid = glamorous.div(grid.container)
const PlainTextGridItem = glamorous.div(grid.plainText, gridItemStyle)
const CipherTextGridItem = glamorous.div(grid.cipherText, gridItemStyle)
const EncryptGridItem = glamorous.div(grid.encrypt, gridItemStyle)
const DecryptGridItem = glamorous.div(grid.decrypt, gridItemStyle)

export {
  EncryptionGrid, PlainTextGridItem, CipherTextGridItem,
  EncryptGridItem, DecryptGridItem
}
