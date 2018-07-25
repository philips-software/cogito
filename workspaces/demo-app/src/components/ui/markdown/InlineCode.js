import React from 'react'
import './coy.css'

const InlineCode = ({children}) => (
  <code style={{lineHeight: 2.0, fontSize: '0.9em'}} className='language-text'>{children}</code>
)

export { InlineCode }
