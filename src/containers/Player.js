import { connect } from 'react-redux'
import { onPlay, onPause, onLoadedmetadata, onTimeupdate } from '../actions/player'
import { onPlayerEvent } from '../actions/player'
import Player from '../componments/Player'
import { timeToMMSS } from '../service/common'

// let _next = (dispatch, audios, currentAudio) => {
//   currentAudio && currentAudio._id && dispatch(next(audios, currentAudio._id))
// }

const mapStateToProps = (state) => {
  return {
    audioInfo: state.player.audioInfo || {},
    playingInfo: state.player.playingInfo || {},
    playlist: state.playlist,
  }
}

const mapDispatchToProps = (dispatch, props) => ({

  next: () => {
    window.PlayerWrapper.changeAudio(window.headlessMusicAppHelper.CONSTANT.INTENTS.NEXT, (playingInfo) => {
      dispatch(onPlayerEvent(playingInfo))
    })
  },
})

let interactPlayer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Player)

export default interactPlayer
