import React from 'react'
import ReactMarkdown from 'react-markdown'
import { CodeBlock, InlineCode, Blockquote } from 'components/ui/markdown'
import { TextLoader } from 'services/documentation-loader'

class Documentation extends React.PureComponent {
  state = { documentation: '' }

  async componentDidMount () {
    const text = await TextLoader.fromFile(this.props.source)
    this.setState({ documentation: text })
  }

  render () {
    return (
      <ReactMarkdown source={this.state.documentation}
        renderers={{
          code: CodeBlock,
          inlineCode: InlineCode,
          blockquote: Blockquote
        }} />
    )
  }
}

export { Documentation }
