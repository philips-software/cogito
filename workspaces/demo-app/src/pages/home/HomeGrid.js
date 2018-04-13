import glamorous from 'glamorous'
import { Grid } from '@philips/css-grid-helper'

let grid = new Grid([
  'sidebar content'
], {
  gridTemplateColumns: '300px auto'
})

const HomeGrid = glamorous.div(grid.container, {
  boxSizing: 'border-box',
  margin: '2rem'
})

const SidebarGridItem = glamorous.div(grid.sidebar, { padding: '1rem' })
const ContentGridItem = glamorous.div(grid.content, { width: '100%' })

export { HomeGrid, SidebarGridItem, ContentGridItem }
