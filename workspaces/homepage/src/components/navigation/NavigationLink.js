import glamorous from 'glamorous'
import { Link } from 'gatsby'

const NavigationLink = glamorous(Link)(props => ({
  display: 'inline-block',
  position: 'relative',
  left: '1rem',
  width: 'calc(100% - 1.5rem)',
  color: 'black',
  fontFamily: 'Roboto Mono, monospace',
  fontWeight: '300',
  fontSize: '0.8rem',
  textDecoration: 'none',
  ':hover': {
    color: 'black',
    textDecoration: 'none'
  },
  ':before': {
    backgroundColor: '#F486CA',
    content: ' ',
    position: 'absolute',
    width: '1px',
    height: '100%',
    top: 0,
    left: '-5px',
    visibility: 'hidden',
    transform: 'scaleY(0.3)',
    transition: 'all 0.3s ease-in-out 0s'
  },
  // '.active:before': {
  //   visibility: 'visible',
  //   transform: 'scaleY(1)',
  //   backgroundColor: '#F486CA'
  // },
  '.active': {
    color: 'black',
    fontFamily: 'Roboto Mono, monospace',
    fontWeight: '500',
    fontSize: '0.8rem',
    transition: 'color 0.2s ease-in-out 0s'
  },
  ':hover:before': {
    visibility: 'visible',
    transform: 'scaleY(1)'
  }
}))

export { NavigationLink }
