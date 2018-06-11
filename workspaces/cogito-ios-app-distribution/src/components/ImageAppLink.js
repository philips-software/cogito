import React from 'react'
import { Image } from 'semantic-ui-react'

const ImageAppLink = () => (
  <Image
    src={require('./Manifest-512px.png')}
    as='a'
    size='medium'
    href='itms-services://?action=download-manifest&url=https://app.cogito.mobi/manifest.plist'
    target='_blank'
  />
)

export { ImageAppLink }
