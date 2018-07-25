import React from 'react'

const blockQuoteStyle = {
  marginLeft: '5px',
  paddingLeft: '1rem',
  borderLeft: '2px solid #bbb',
  fontSize: '0.9em',
  color: '#777'
}

const Blockquote = ({children}) => (
  <blockquote style={blockQuoteStyle}>
    <p>
      {children}
    </p>
  </blockquote>
)

export { Blockquote }
