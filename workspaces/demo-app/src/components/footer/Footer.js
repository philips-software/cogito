import React from 'react'

import glamorous from 'glamorous'
import { Centered } from 'components/layout'

const PinkText = glamorous.p({
  color: '#ff80c3',
  fontSize: '0.8rem'
})

const CenteredBottomContent = glamorous(Centered)({
  justifyContent: 'flex-end',
  height: '100%'
})

export const Footer = () =>
  <CenteredBottomContent>
    <PinkText>© 2018 by Charterhouse</PinkText>
  </CenteredBottomContent>
