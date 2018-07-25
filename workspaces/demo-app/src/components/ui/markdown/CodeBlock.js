import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs'

export class CodeBlock extends React.PureComponent {
  render () {
    const { language, value } = this.props

    return (
      <SyntaxHighlighter language={language} style={tomorrowNight}>
        {value}
      </SyntaxHighlighter>
    )
  }
}
