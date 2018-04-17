import React from 'react'
import { Segment } from 'semantic-ui-react'
import { PageCentered, Spacer } from 'components/layout'
import { Footer } from 'components/styling'
import { StandardGrid, HeaderGridItem, ContentLeftGridItem,
  ContentRightGridItem, FooterGridItem } from 'components/layout/StandardGrid'
import { WithStore } from 'app-state'

import glamorous from 'glamorous'

const GoodSize = glamorous.div({
  minHeight: '350px',
  maxHeight: '350px',
  overflow: 'auto'
})

const getCurrentUser = (state) =>
  state.users && state.users.selectedUser && state.users[state.users.selectedUser]

const getCurrentlySelectedAlgorithm = (state) =>
  state.algorithms.list.find(alg => alg.id === state.algorithms.selected)

const StandardLayout = ({ header, contentLeft, contentRight }) =>
  <WithStore selector={state => ({
    user: getCurrentUser(state),
    algorithms: state.algorithms.list,
    selectedAlgorithm: getCurrentlySelectedAlgorithm(state),
    selectedAlgorithmId: state.algorithms.selected,
    licenses: state.licenses,
    selectedLicenseAddress: state.admin.selectedLicense,
    selectedUniversityLicenseAddress: state.university.selectedLicense,
    selectedStoreLicenseAddress: state.store.selectedLicense
  })} >
    {
      (props, dispatch) =>
        <PageCentered>
          <Spacer margin='50px'>
            <Segment raised style={{
              minWidth: '960px',
              maxWidth: '960px'
            }}>
              <StandardGrid>
                <HeaderGridItem>
                  { header(props, dispatch) }
                </HeaderGridItem>
                <ContentLeftGridItem>
                  <GoodSize>
                    { contentLeft(props, dispatch) }
                  </GoodSize>
                </ContentLeftGridItem>
                <ContentRightGridItem>
                  { contentRight(props, dispatch) }
                </ContentRightGridItem>
                <FooterGridItem>
                  <Footer />
                </FooterGridItem>
              </StandardGrid>
            </Segment>
          </Spacer>
        </PageCentered>
    }
  </WithStore>

export { StandardLayout }
