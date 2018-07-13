import glamorous from 'glamorous'
import { rhythm } from '../utils/typography'
import { Grid } from '@react-frontend-developer/css-grid-helper'

let grid = new Grid([
  'sidebar content'
], {
  gridTemplateColumns: '300px auto'
})

const LayoutGrid = glamorous.div(grid.container, {
  boxSizing: 'border-box',
  margin: rhythm(1)
})

const SidebarGridItem = glamorous.div(grid.sidebar)
const ContentGridItem = glamorous.div(grid.content, { width: '100%', padding: '1rem' })

export { LayoutGrid, SidebarGridItem, ContentGridItem }
