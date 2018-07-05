import React from 'react'

import glamorous from 'glamorous'
import { Icon, Dropdown } from 'semantic-ui-react'

import PropTypes from 'prop-types'

const UserIcon = glamorous(Icon)({
  color: 'white'
})

const Wrapper = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ff80c3',
  padding: '20px',
  width: '100%',
  height: '5em',
  fontSize: '14pt',
  color: 'white'
})

const TopBar = ({user, switchUser}) => {
  if (!user) {
    return <EmptyTopBar />
  } else {
    return <UserTopBar user={user} switchUser={switchUser} />
  }
}

const EmptyTopBar = () => <Wrapper><div>Demo App</div></Wrapper>

const UserTopBar = ({user, switchUser}) =>
  <Wrapper>
    <div>{user.role}</div>
    <div>
      <UserIcon name='user' size='big' />
      <Dropdown text={user.name}>
        <Dropdown.Menu style={{top: '30px', left: '-20px'}} >
          <Dropdown.Item text='Switch user...' onClick={switchUser} />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </Wrapper>

TopBar.propTypes = {
  user: PropTypes.object,
  switchUser: PropTypes.func
}

UserTopBar.propTypes = TopBar.propTypes

export { TopBar }
