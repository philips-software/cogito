import { React } from 'react'
import glamorous from 'glamorous'
import { Link } from 'gatsby'

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

export { SiteTitle }
