module.exports = {
  siteMetadata: {
    title: 'Cogito',
    editBaseUrl: 'https://github.com/philips-software/cogito/blob/master'
  },
  plugins: [
    {
      resolve: '@confluenza/gatsby-theme-confluenza',
      options: {
        mdx: true
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-root-import'
  ]
}
