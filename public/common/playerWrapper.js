var PlayerWrapper = (function () {
'use strict';
let CONSTANT = headlessMusicAppHelper.CONSTANT
let PLAYER_STATE = CONSTANT.PLAYER_STATE
let audioElement, audioItems, playingIndex = 0, playingInfo = { player_state: null }, eventsCallbacks, currentIntentQuery

/**####################################
 * headlessMusicAppHelper.isAmbientMode is used to set the app mode. 
 * when isAmbientMode = true, the app will run with headless UI(implemented by another common app )
 * Now, AmbientMode is set to false to show the separated app.
 * 
 **####################################**/

let AmbientMode = false;//headlessMusicAppHelper.isAmbientMode()



let IntentResponseText = {
  [CONSTANT.INTENTS.PLAY]: 'Okay. Music is playing.',
  [CONSTANT.INTENTS.PAUSE]: 'Okay. Music is paused.',
  [CONSTANT.INTENTS.RESUME]: 'Okay. Music is resumed',
  [CONSTANT.INTENTS.STOP]: 'Okay. Music is stoped',
  [CONSTANT.INTENTS.NEXT]: 'Okay. Next one is played.',
  [CONSTANT.INTENTS.PREVIOUS]: 'Okay. Previous one is played.',
  [CONSTANT.INTENTS.RESTART]: 'Okay. Next one is restarted.',
  [CONSTANT.INTENTS.LOGIN]: 'Okay. Go to login.',
  'FALSE': 'Failed.',
}

let PLAYER_STATE_ON_EVENT = {
  loadedmetadata: PLAYER_STATE.INIT,
  timeupdate: PLAYER_STATE.PLAYING,
  play: PLAYER_STATE.PLAYING,
  pause: PLAYER_STATE.PAUSED,
  ended: PLAYER_STATE.STOPED,
  waiting: PLAYER_STATE.WAITING,
  playing: PLAYER_STATE.PLAYING,
}

const run = (playlistUIUpdater, playerUIUpdater) => {
  const messageHander = (data) => {
    console.log('[fmreact player wrapper] receive message from headless music app:' + JSON.stringify(data))
    let message = JSON.parse(data['message'])
    let intentQuery = message.intentQuery
    currentIntentQuery = intentQuery
    if (intentQuery) {
      let result = intentPerformer[intentQuery.intent](intentQuery, playlistUIUpdater)
      result !== undefined && (headlessMusicAppHelper.intentResponse(result, IntentResponseText[result ? intentQuery.intent : 'FALSE']))
    } else {
      console.log('[fmreact player wrapper] The message has NO intentQuery info.')
      /*keyEventsPerformer: 
         - used to handle the Remote Control key events.
         - the app receives the message with Key Code from the Music Launcher. (As the app is running background)
         - is only used for AmbientMode. When on TV mode, the app will response the Remote Control directly.
      */
      AmbientMode && message.keyCode && keyEventsPerformer(message.keyCode)
    }
  }
  
  // Audo Element
  audioElement = getAudioElementInstance();
  ['loadedmetadata', 'playing', 'play', 'pause', 'waiting', 'timeupdate', 'ended', 'error'].forEach((eventName) => {
    audioElement.addEventListener(eventName, (event) => {
      let state = PLAYER_STATE_ON_EVENT[eventName];
      let content = eventName === 'error' ? [undefined, undefined, undefined, undefined, 'AUDIO_PLAYER_ERROR', JSON.stringify(event)] : [state, event.target];
      //(state, target, item, isSignin, result, error) 
      if(state === PLAYER_STATE.INIT) {
        content = [PLAYER_STATE.INIT, event.target, audioItems[playingIndex], false, null, null];
      }
      playingInfo = preparePlayingInfo(...content)
      AmbientMode ? send(playingInfo) : (playerUIUpdater && playerUIUpdater(playingInfo))
      eventsCallbacks[eventName] && eventsCallbacks[eventName](event)
    })
  })

  // regist the intents from Music Launcher
  headlessMusicAppHelper.addMessageListener(messageHander)
}

const keyEventsPerformer = (keyCode) => {
  switch (keyCode) {
    case CONSTANT.KEY_CODE.MediaPlay:
      audioElement && audioElement.play()
      break
    case CONSTANT.KEY_CODE.MediaPause:
      audioElement && audioElement.pause()
      break
    case CONSTANT.KEY_CODE.MediaPlayPause:
      togglePlay()
      break
    case CONSTANT.KEY_CODE.MediaStop:
      if (audioElement) {
        audioElement.pause()
      }
      break
    case CONSTANT.KEY_CODE.MediaTrackNext:
      changeAudio(CONSTANT.INTENTS.NEXT)
      break
    case CONSTANT.KEY_CODE.MediaTrackPrevious:
      changeAudio(CONSTANT.INTENTS.PREVIOUS)
      break
    default:
      send({
        keyCode: keyCode,
        result: 'KEY_NOT_REGISTED'
      })
  }
}

const getAudioElementInstance = (src) => {
  if (!audioElement) {
    audioElement = document.createElement('audio')
    console.log('[fmreact player wrapper] audio created.')
    audioElement.controls = false; // TODO
    audioElement.autoplay = true;
    audioElement.preload = 'auto';
  }
  src && (audioElement.src = src)
  return audioElement
}

const intentPerformer = {
  [CONSTANT.INTENTS.PLAY]: (intentQuery, playlistUIUpdater) => {
    console.log('[fmreact player wrapper] intent = PLAY')
    let params // get random songs if params is undefined
    if (intentQuery.content || intentQuery.album || intentQuery.artist || intentQuery.genre || intentQuery.station) {
      params = {
        title: intentQuery.content,
        artist: intentQuery.artist,
        album: intentQuery.album,
        genre: intentQuery.genre,
        station: intentQuery.station,
      }
    }
    audiosData.fetchAudios(params, (items) => {
      playlistUIUpdater && playlistUIUpdater(items) //when ambient mode is OFF
      fetchAudiosCallback(items)
      headlessMusicAppHelper.intentResponse(true, IntentResponseText[intentQuery.intent])
    }, () => {
      headlessMusicAppHelper.intentResponse(false, IntentResponseText['FALSE'])
      errorPerformer(CONSTANT.ERROR.AUDIO_NOT_FOUNDED)
    })
    return undefined// TODO - 'response when auido metadata is loaded'
  },
  [CONSTANT.INTENTS.PAUSE]: (intentQuery) => {
    console.log('[fmreact player wrapper] intent = PAUSE')
    if (audioElement.src) {
      audioElement.pause()
      return true
    } else {
      return false
    }
  },
  [CONSTANT.INTENTS.RESUME]: () => {
    console.log('[fmreact player wrapper] intent = RESUME')
    if (audioElement.src) {
      audioElement.play()
      return true
    } else {
      return false
    }
  },
  [CONSTANT.INTENTS.STOP]: () => {
    console.log('[fmreact player wrapper] intent = STOP')
    if (audioElement.src) {
      audioElement.pause()
      return true
    } else {
      return false
    }
  },
  [CONSTANT.INTENTS.RESTART]: () => {
    console.log('[fmreact player wrapper] intent = Restart')
    if (audioElement.src) {
      audioElement.currentTime = 0
      audioElement.play()
      return true
    } else {
      return false
    }
  },
  [CONSTANT.INTENTS.NEXT]: () => {
    console.log('[fmreact player wrapper] intent = PlayNext')
    changeAudio(CONSTANT.INTENTS.NEXT)
    return true
  },
  [CONSTANT.INTENTS.PREVIOUS]: () => {
    console.log('[fmreact player wrapper] intent = PlayPrevious')
    changeAudio(CONSTANT.INTENTS.PREVIOUS)
    return true
  },
  [CONSTANT.INTENTS.LOGIN]: () => {
    console.log('[fmreact player wrapper] intent = Login')
    return true //Login TODO
  }
}

const fetchAudiosCallback = (items) => {
  console.log('[fmreact player wrapper] fetch Audios Callback items: ' + JSON.stringify(items))
  audioItems = items
  playingIndex = 0
  if (items && items[playingIndex] && items[playingIndex].url) {
    let item = items[playingIndex]
    console.log('[fmreact player wrapper] fetch Audios Callback item: ' + JSON.stringify(item))
    audioElement = getAudioElementInstance(item.url)
  } else {// AUDIO NOT FOUND
    errorPerformer(CONSTANT.ERROR.AUDIO_NOT_FOUNDED)
  }
}

eventsCallbacks = {
  loadeddata: (event) => {
    console.log('[fmreact player wrapper] loadeddata')
  },
  loadedmetadata: (event) => {
    console.log('[fmreact player wrapper] onLoadedmetadata, the current audio url: ' + JSON.stringify(audioElement.src))
  },
  ended: (event) => {
    changeAudio(CONSTANT.INTENTS.NEXT, null)
  },
  error: (event) => {
    console.log('[fmreact player wrapper] error:' + JSON.stringify(event))
  }
}

const changeAudio = (action, cb) => {
  if (audioItems && audioItems.length) {
    let nextIndex
    if (action === CONSTANT.INTENTS.PREVIOUS) {
      nextIndex = --playingIndex
    } else {
      nextIndex = ++playingIndex
    }
    playingIndex = (nextIndex === audioItems.length || nextIndex < 0) ? 0 : nextIndex
    console.log('[fmreact player wrapper] audio index to play:             ' + playingIndex)
    cb && cb(preparePlayingInfo(PLAYER_STATE.PLAYING, null)) // used to update the player UI, Ambient Mode = Off
    audioElement = getAudioElementInstance(audioItems[playingIndex].url)
  } else {
    errorPerformer(CONSTANT.ERROR.AUDIO_NOT_FOUNDED)
  }
}

const setAudio = (audioId, cb) => {
  audioItems.forEach((audio, i) => {
    audio._id === audioId && (playingIndex = i)
  })
  cb && cb(preparePlayingInfo(PLAYER_STATE.PLAYING, null))// used to update the player UI, Ambient Mode = Off
  audioElement = getAudioElementInstance(audioItems[playingIndex].url)
}

const togglePlay = () => {
  audioElement && (playingInfo.player_state === CONSTANT.PLAYER_STATE.PLAYING ? audioElement.pause() : audioElement.play())
}

const preparePlayingInfo = (state, target, item, isSignin, result, error) =>{
  let data =  {
    'player_state': state
  }
  if(target) {
    data['player_position'] = parseInt(target.currentTime * 1000)
    data['player_duration'] = parseInt(target.duration * 1000) || 0
  }
  error && (data['error'] = error)
  result && (data['result'] = result)
  isSignin !== undefined && (data['sign_in'] = !!isSignin)
  item && Object.assign(data, item)
  return data
}

const send = (content) => {
  if (!content) { return }
  headlessMusicAppHelper.sendMessage([{
    'key': 'message',
    'value': JSON.stringify(content)
  }])
}

const errorPerformer = (errorText) => {
  send({
    'error': errorText,
    'result': errorText,
  })
}

var _PlayerWrapper = {
  run: run,
  audioElement: getAudioElementInstance,
  audioItems: audioItems,
  playingIndex: playingIndex,
  setAudio: setAudio,
  playingInfo: playingInfo,
  changeAudio: changeAudio,
  togglePlay:togglePlay,
};

return _PlayerWrapper;

}());
