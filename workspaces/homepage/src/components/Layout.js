import { React } from 'react'
import '../prismjs/themes/prism-tomorrow.css'
import { StaticQuery, graphql, Link } from 'gatsby'
import glamorous from 'glamorous'
import { rhythm } from '../utils/typography'

import { LayoutGrid, SidebarGridItem, ContentGridItem } from './LayoutGrid'
import { Navigation } from './navigation'

const Wrapper = glamorous.div({
  backgroundColor: 'black',
  color: 'white',
  fontFamily: 'Roboto Mono, monospace',
  fontWeight: '300',
  fontSize: '1.2rem',
  textAlign: 'center',
  verticalAlign: 'middle',
  padding: '10px',
  marginBottom: '2rem'
})

const HomeLink = glamorous(Link)({
  color: 'white',
  fontWeight: '300',
  ':hover': {
    color: 'white',
    textDecoration: 'none'
  }
})

const SiteTitle = ({title}) => (
  <HomeLink to='/'>
    <Wrapper>
      { title }
    </Wrapper>
  </HomeLink>
)

export const FixedNavigation = glamorous.div({
  display: 'block',
  position: 'fixed',
  top: 0,
  minWidth: '300px',
  maxWidth: '300px',
  height: `calc(100vh - ${rhythm(2)})`,
  overflowY: 'auto',
  backgroundColor: '#F7F7F7',
  WebkitOverflowScrolling: `touch`,
  '::-webkit-scrollbar': {
    width: `6px`,
    height: `6px`
  },
  '::-webkit-scrollbar-thumb': {
    background: '#ccc'
  }
})

const Layout = ({ children, location }) => (
  <StaticQuery
    query={graphql`
      query Navigation {
        site {
          siteMetadata {
            title
          }
        }
        navigation: allMarkdownRemark(
          filter: { frontmatter: { path: { ne: "/404.html" } } }
          sort: { fields: [fileAbsolutePath], order: ASC }
        ) {
          docs: edges {
            node {
              frontmatter {
                title
                path
                tag
              }
              headings(depth: h2) {
                value
              }
            }
          }
        }
      }
    `}
    render={data => {
      const { site: { siteMetadata: { title } }, navigation: { docs } } = data
      return (
        <LayoutGrid>
          <SidebarGridItem>
            <FixedNavigation>
              <SiteTitle title={title} />
              <Navigation docs={docs} location={location} />
            </FixedNavigation>
          </SidebarGridItem>
          <ContentGridItem>
            { children }
          </ContentGridItem>
        </LayoutGrid>
      )
    }}
  />
)

export default Layout
