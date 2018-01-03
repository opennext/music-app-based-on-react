import React, { Component } from 'react'
import Player from '../containers/Player'
import Playlist from '../containers/Playlist'
import { setPlaylist } from '../actions/playlist'
import { setAudio,onPlayerEvent } from '../actions/player'

import Login from './Login'
import Album from './Album'

//import { appControlData, sendRemoteMessage, addLocalMessagePortListener } from '../service/tizen'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import './App.css'

const INTENTS = {
  PLAY: 'Play',
  PAUSE: 'Pause',
  RESUME: 'Resume',
  STOP: 'Stop',
  NEXT: 'PlayNext',
  PREVIOUS: 'PlayPrevious',
  RESTART: 'Restart',
  LOGIN: 'Login',
}

class App extends Component {
  constructor(props) {
    super(props)
    let requestPage = 'play some music', payload
    // console.log('appControlData: ' + JSON.stringify(appControlData))
    // // payload format - ["{\"method\" :\"directPage\",\"params\" : {\"page\" :\"login\"}}"]
    // if (appControlData && appControlData['PAYLOAD']) {
    //   payload = [].concat(JSON.parse(appControlData['PAYLOAD']))
    //   payload.forEach((value) => {
    //     requestPage = value.method === 'directPage' ? value.params.page : requestPage
    //   })
    // }
    this.state = { requestPage }
  }
  componentDidMount() {
    let playlistUIUpdater = (items) => {
      console.log('[fmreact ui] audioItemsUpdater - items: ' + JSON.stringify(items))
      this.props.store.dispatch(setPlaylist({
        id: 0,
        album: 'album name',
        albumArt: '',
        audios: items,
      }))
      this.props.store.dispatch(onPlayerEvent(items[0]))
      window.headlessMusicAppHelper.ready()
    }

    window.PlayerWrapper.run(playlistUIUpdater, (playingInfo) => {
      this.props.store.dispatch(onPlayerEvent(playingInfo))
    })
  }
  render() {
    return (
      <div>
        {
          ['login', 'signin', 'sign in', '登陆'].some((s) => s === this.state.requestPage) ? <LoginWrapper /> : <PlayerUI />
        }
      </div>
    )
  }
}

class LoginWrapper extends Component {
  render() {
    return <Login loginedCallback={() => this.setState({ requestPage: 'play some music' })}></Login>
  }
}

class PlayerUI extends Component {
  render() {
    return (
      <div>
        <div className='playlist-container' style={{ display: 'block' }}>
          {true && <Playlist></Playlist>}
        </div>
        <div className='player-container'>
          <Player></Player>
          <div className='copyright'>Use arrow keys[left, right, up, or down] to move the Foucs.</div>
        </div>
      </div>
    )
  }
}

export default App