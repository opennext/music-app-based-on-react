import React, { Component } from 'react'
import './Player.css'
import {FaThumbsOUp, FaThumbsODown, FaStepForward, FaPlay} from 'react-icons/lib/fa'
import {Focusable} from '../react-tv.js'
import PlayerWithoutControls from './PlayerWithoutControls'
import { timeToMMSS } from '../service/common'

let playerType = 1 // 0 - NACL Plugin Player, 1 - H5 Audio


// PLAYER_STATE: {
//   INIT: 'init',
//   PLAYING: 'playing',
//   PAUSED: 'pause',
//   STOPED: 'stop',
//   WAITING: 'waiting'
// }
const PLAYER_STATE = window.headlessMusicAppHelper.CONSTANT.PLAYER_STATE

class Player extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <div className='player'>
    <div className='player-background' style={{ backgroundImage: 'url(' + this.props.audioInfo.album_art + ')'}}></div>
    <Focusable name='focusable-0' initialFocus={true} className='cover-container' onSelected={() => window.PlayerWrapper.togglePlay()}>
      <img className='cover-image' src={this.props.audioInfo.album_art} alt=''/>
      <div className='play-icon'>{ (this.props.playingInfo.player_state === PLAYER_STATE.PLAYING || this.props.playingInfo.player_state === PLAYER_STATE.INIT) || <FaPlay color='#FFF' size={120}/>}</div>
    </Focusable>
    <div className='info-container'>
      <div className='app-name'>FM</div>
      <div className='playlist-name'>{this.props.audioInfo.genre && this.props.audioInfo.genre[0] || 'unknown genre'}</div>
      <div className='audio-info'>
        <div className='title'>{this.props.audioInfo.title}</div>
        <div className='artist'>{this.props.audioInfo.artist}</div>
        {/* ToBeDel, PlayerWithoutControls have been replaced by common\playerWrapper.js
          playerType === 1 && <PlayerWithoutControls autoPlay={true} src={this.props.playingInfo.src} onLoadedmetadata={this.props.onLoadedmetadata} onTimeupdate={this.props.onTimeupdate} onPlay={this.props.onPlay} onPause={this.props.onPause} onEnd={this.props.onEnd}></PlayerWithoutControls>
        */}
      </div>
      <div className='process'>
        <div className='time current-time'>{timeToMMSS(this.props.playingInfo.player_position || 0) || '00:00'}</div>
        <div className='bar'>
          
        </div>
        <div className='time duration'>{timeToMMSS(this.props.playingInfo.player_duration || 0) || '00:00'}</div>
      </div>
    </div>
    <div className='operation-container'>
      <Focusable name='focusable-1' className='operation'><FaThumbsOUp color='#FFF' size={48}/></Focusable>
      <Focusable name='focusable-2' className='operation'><FaThumbsODown color='#FFF' size={48}/></Focusable>
      <Focusable name='focusable-3' className='operation' onSelected={() => this.props.next()}><FaStepForward color='#FFF' size={48}/></Focusable>
    </div>
  </div>
  }
}

export default Player;