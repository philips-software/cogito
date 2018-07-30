import glamorous from 'glamorous'

import { Grid } from '@react-frontend-developer/css-grid-helper'

let grid = new Grid([
  'header',
  'content',
  'footer'
], {
  gridTemplateRows: 'max-content 1fr max-content'
})

const contentBaseStyle = {
  padding: '15px'
}

const NoMatch404Grid = glamorous.div(grid.container, {
  boxSizing: 'border-box',
  height: '100vh'
})

const HeaderGridItem = glamorous.div(grid.header, contentBaseStyle)
const ContentGridItem = glamorous.div(grid.content, contentBaseStyle)
const FooterGridItem = glamorous.div(grid.footer, contentBaseStyle)

export {
  NoMatch404Grid, HeaderGridItem, ContentGridItem, FooterGridItem
}
