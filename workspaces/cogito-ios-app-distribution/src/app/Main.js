import React from 'react'

import { PageCentered } from '@react-frontend-developer/react-layout-helpers'
import { ImageAppLink } from '../components/imageAppLink'
import { P, B } from 'glamorous'
import { Button } from 'semantic-ui-react'

class Main extends React.Component {
  render () {
    return (
      <PageCentered>
        <div style={{width: '300px', height: '400px'}}>
          <P>This is the download page for <B>Cogito iOS App</B></P>
          <ImageAppLink />
          <Button
            basic
            color='pink'
            href='itms-services://?action=download-manifest&url=https://app.cogito.mobi/manifest.plist'
            fluid
          >
            Download Cogito iOS App
          </Button>
        </div>
      </PageCentered>
    )
  }
}

export { Main }
