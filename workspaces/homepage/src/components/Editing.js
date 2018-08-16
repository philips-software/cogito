import React from 'react'

const editUrl = 'https://github.com/philips-software/cogito/blob/master'

export const EditFile = ({ fileAbsolutePath }) => {
  const match = fileAbsolutePath.match(/workspaces.*$/)
  if (match) {
    const fileRelativePath = match[0]
    return (
      <div>
        <a href={`${editUrl}/${fileRelativePath}`}>Edit this page</a>
      </div>
    )
  }
  return null
}
