import { connect } from 'react-redux'
import { itemSelected } from '../actions/playlist'
import { setAudio, onPlayerEvent } from '../actions/player'
import Playlist from '../componments/Playlist'


const mapStateToProps = (state) => {
  return {
    playlist: state.playlist
  }
}

const mapDispatchToProps = (dispatch) => ({
  onItemSelected: (item) => {
    dispatch(setAudio(item))
    dispatch(itemSelected(item))
    window.PlayerWrapper.setAudio(item._id,  (playingInfo) => {
      dispatch(onPlayerEvent(playingInfo))
    })
  }
})

let interactPlaylist = connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlist)

export default interactPlaylist
