export function loadState () {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    let state = JSON.parse(serializedState)
    return state
  } catch (error) {
    return undefined
  }
}

export function saveState (state) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('state', serializedState)
  } catch (error) {
    console.error(error)
  }
}
