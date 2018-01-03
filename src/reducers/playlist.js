
const playlist = (state = {}, action) => {
  switch (action.type) {
    case 'ITEM_SELECTED':
      return state
    case 'SET_PLAYLIST':
      return action.playlist
    default:
      return state
  }
}

export default playlist