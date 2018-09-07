import Typography from 'typography'
import moragaTheme from 'typography-theme-moraga'

moragaTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  'a': {
    textDecoration: 'none'
  },
  'a:hover': {
    textDecoration: 'none'
  },
  'blockquote > p': {
    fontSize: '1rem'
  }
})

moragaTheme.googleFonts = [
  {
    name: 'Source Sans Pro',
    styles: ['200', '400', '400i', '700']
  },
  {
    name: 'Roboto Mono',
    styles: ['100', '100i', '300', '300i', '400', '400i', '500', '500i']
  }
]

const typography = new Typography(moragaTheme)

const { rhythm, scale } = typography
export { rhythm, scale, typography as default }
