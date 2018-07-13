import React from 'react'
import Helmet from 'react-helmet'
import { EditFile } from '../components/Editing'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'

const Template = ({ data: { doc } }) => {
  const { html, fileAbsolutePath, frontmatter: { title } } = doc
  return (
    <Layout>
      <Helmet title={title} />
      <EditFile fileAbsolutePath={fileAbsolutePath} />
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
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
