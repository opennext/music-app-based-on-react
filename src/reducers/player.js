
const player = (state = {}, action) => {
  switch (action.type) {
    case 'SET_AUDIO':
      return { ...state, audioInfo: action.audio }
    case 'ON_PLAYER_EVENT':
      if(action.playingInfo && action.playingInfo.player_state === window.headlessMusicAppHelper.CONSTANT.PLAYER_STATE.INIT) {
        return {
          ...state,
          playingInfo: action.playingInfo,
          audioInfo: action.playingInfo,
        }
      } else {
        return {...state, playingInfo: action.playingInfo}
      }
    default:
      return state
  }
}

export default player