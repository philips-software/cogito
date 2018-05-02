import React from 'react'
import { Centered, Spacer } from '@react-frontend-developer/react-layout-helpers'
import { Link } from 'react-router-dom'

const Footer = () =>
  <Spacer margin='20px 0 0 0'>
    <Centered>
      <Link to='/users'>Switch user</Link>
    </Centered>
  </Spacer>

export { Footer }
