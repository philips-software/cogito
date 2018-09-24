import React from 'react'
import Helmet from 'react-helmet'
import { EditFile } from 'src/components/Editing'
import { graphql } from 'gatsby'

const Template = ({ data: { doc }, location }) => {
  const { html, fileAbsolutePath, frontmatter: { title } } = doc
  return (
    <div>
      <Helmet title={title} />
      <EditFile fileAbsolutePath={fileAbsolutePath} />
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export const pageQuery = graphql`
  query MarkdownByPath($path: String!) {
    doc: markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      fileAbsolutePath
      frontmatter {
        title
      }
    }
  }
`

export default Template
