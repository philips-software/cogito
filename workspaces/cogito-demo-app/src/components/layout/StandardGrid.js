import glamorous from 'glamorous'

import { Grid } from 'services/grid'

let grid = new Grid([
  'header header',
  'contentLeft contnetRight',
  'footer footer'
], {
  gridTemplateRows: 'max-content max-content max-content',
  gridTemplateColumns: '5fr 3fr'
})

const contentBaseStyle = {
  padding: '15px'
}

const StandardGrid = glamorous.div(grid.container, { boxSizing: 'border-box' })

const HeaderGridItem = glamorous.div(grid.header)
const ContentLeftGridItem = glamorous.div(grid.contentLeft, contentBaseStyle)
const ContentRightGridItem = glamorous.div(grid.contentRight, contentBaseStyle)
const FooterGridItem = glamorous.div(grid.footer)

export { StandardGrid, HeaderGridItem, ContentLeftGridItem,
  ContentRightGridItem, FooterGridItem }
