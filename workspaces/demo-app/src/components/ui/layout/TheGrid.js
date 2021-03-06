import glamorous from 'glamorous'

import { Grid } from '@react-frontend-developer/css-grid-helper'

let grid = new Grid([
  'header         header',
  'demo           documentation',
  'demoNavigation documentation',
  'footer         footer'
], {
  gridTemplateRows: 'max-content 1fr max-content max-content'
})

const contentBaseStyle = {
  padding: '15px'
}

const TheGrid = glamorous.div(grid.container, {
  boxSizing: 'border-box',
  height: '100vh'
})

const HeaderGridItem = glamorous.div(grid.header, contentBaseStyle)
const DemoGridItem = glamorous.div(grid.demo, contentBaseStyle)
const DemoNavigationGridItem = glamorous.div(grid.demoNavigation, contentBaseStyle)
const DocumentationGridItem = glamorous.div(
  grid.documentation,
  contentBaseStyle,
  { borderLeft: '1px solid black', overflow: 'auto' }
)
const FooterGridItem = glamorous.div(grid.footer, contentBaseStyle)

export {
  TheGrid, HeaderGridItem, DemoGridItem, DemoNavigationGridItem,
  DocumentationGridItem, FooterGridItem
}
