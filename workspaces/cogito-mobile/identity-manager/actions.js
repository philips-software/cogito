import { createAction } from 'redux-starter-kit'

export const add = name => async dispatch => {
  dispatch(store(name))
}

export const store = createAction('identity/store')
