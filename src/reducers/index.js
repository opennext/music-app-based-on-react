import { combineReducers } from 'redux'
import player from './player'
import playlist from './playlist'


export default combineReducers({
  player,
  playlist
})
