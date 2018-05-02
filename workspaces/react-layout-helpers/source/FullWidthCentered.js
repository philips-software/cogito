import glamorous from 'glamorous'
import { Centered } from './Centered'

export const FullWidthCentered = glamorous(Centered)({
  padding: '20px',
  width: '100%',
  height: '100%',
  backgroundColor: '#f2f2f2',
  borderBottom: '1px solid #ff80c3',
  justifyContent: 'flex-start'
})
