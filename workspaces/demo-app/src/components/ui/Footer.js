import React from 'react'

import glamorous from 'glamorous'
import { Centered } from '@react-frontend-developer/react-layout-helpers'

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
    <PinkText>© 2018 by Cogito</PinkText>
  </CenteredBottomContent>
