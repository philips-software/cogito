import React from 'react'
import glamorous from 'glamorous'

const Code = glamorous.code({
  display: 'inline',
  background: 'none',
  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  whiteSpace: 'normal',
  wordSpacing: 'normal',
  wordBreak: 'normal',
  wordWrap: 'normal',
  hyphens: 'none',
  padding: '.2em',
  borderRadius: '0.3em',
  color: '#c92c2c',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  lineHeight: 2.0,
  fontSize: '0.9em'
})

const InlineCode = ({children}) => (
  <Code>{children}</Code>
)

export { InlineCode }
