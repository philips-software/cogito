import React from 'react'
import Helmet from 'react-helmet'
import { EditFile } from 'src/components/Editing'
import { graphql } from 'gatsby'
import glamorous from 'glamorous'

const Template = ({ data: { site: { siteMetadata }, doc }, location }) => {
  const { html, fileAbsolutePath, frontmatter: { title, content } } = doc
  const { editBaseUrl } = siteMetadata
  return (
    <div>
      <Helmet title={title} />
      <EditFile fileAbsolutePath={fileAbsolutePath}
        externalContent={content}
        editBaseUrl={editBaseUrl} />
      <h1>{title}</h1>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: content ? content.childMarkdownRemark.html.split('\n').slice(1).join('\n') : html }} />
        { content && html !== '' && <div dangerouslySetInnerHTML={{ __html: html }} />}
      </Content>
    </div>
  )
}

const Content = glamorous.div({
  maxWidth: '40em'
})

export const pageQuery = graphql`
  query MarkdownByPath($path: String!) {
    site: site {
      siteMetadata {
        title
        editBaseUrl
      }
    }
    doc: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      fileAbsolutePath
      frontmatter {
        title
        content {
          childMarkdownRemark {
            html
            fileAbsolutePath
          }
        }
      }
    }
  }
`

export default Template
