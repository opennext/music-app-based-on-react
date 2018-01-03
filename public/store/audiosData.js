var audiosData = (function () {
  'use strict';

  const serverAdress = 'http://xxx:3000/'

  const fetchPlaylist = (params, scb, ecb) => {
    scb && scb([{
      "_id": "5a00256aa0034f85050e933d",
      "provider": "spotify",
      "title": "stereo radio right",
      "sid": "1",
      "artist": "galactic heroes",
      "album": "stereo radio right",
      "album_art": "https://img3.doubanio.com/lpic/s1634021.jpg",
      "genre": ["Pop"],
      "url": "http://mr1.doubanio.com/df6512c2b8812507106492927323739c/0/fm/song/p706572_128k.mp4"
    },
    {
      "_id": "5a0026d4a0034f85050e933e",
      "provider": "spotify",
      "title": "yellow river",
      "sid": "2",
      "artist": "elton john",
      "album": "the legendary covers album",
      "album_art": "https://img3.doubanio.com/img/fmadmin/large/32626.jpg",
      "genre": ["Pop"],
      "url": "http://mr3.doubanio.com/ab00b370d2a20bf727839091f5140b43/0/fm/song/p2180275_128k.mp4"
    },
    {
      "_id": "5a002815a0034f85050e933f",
      "provider": "spotify",
      "title": "somebody that i used to know",
      "sid": "3",
      "artist": "gotye / kimbra",
      "album": "making mirrors",
      "album_art": "https://img3.doubanio.com/img/fmadmin/large/32921.jpg",
      "genre": ["Pop ddd"],
      "url": "http://mr3.doubanio.com/608a36b0dfcdcd0c156bf16adb677769/1/fm/song/p1797456_128k.mp4"
    }])

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (response) => {
      console.log('[fmreact - store] load audio data from server, data: ' + response.responseText)
    })
    xhr.open('POST', 'http://xxx:3000/v1/playlist')
    xhr.send()
  }

  const fetchAudios = (params, scb = () => { }, ecb) => {
   
    var defaultSongs = [{
      "_id": "5a09935b199de7ec3d938f5d",
      "provider": "spotify",
      "title": "takes one to know one",
      "sid": "459", "artist":
      "amy diamond",
      "album": "music in motion",
      "album_art": "https://img3.doubanio.com/lpic/s2799962.jpg",
      "url": "http://mr3.doubanio.com/3493f223e4598f7b5a5e2f0768a6b48c/0/fm/song/p459_128k.mp4",
      "station_id": ["1"], "genre": ["Pop"], "__v": 0
    }, {
      "_id": "5a099363b207fcec791bbb1c",
      "provider": "spotify",
      "title": "mirsilo",
      "sid": "817",
      "artist":
      "ataraxia",
      "album": "arcana eco",
      "album_art": "https://img1.doubanio.com/lpic/s4716569.jpg",
      "url": "http://mr3.doubanio.com/34ec6ee116609ffa6142ef3e0a6c26b5/0/fm/song/p817_128k.mp4",
      "station_id": ["1"],
      "genre": ["Rock"], "__v": 0
    }, {
      "_id": "5a0993684b6beaec97a30f38", "provider": "spotify", "title": "luck and fear",
      "sid": "378", "artist": "alias / tarsier", "album": "brookland/oaklyn",
      "album_art": "https://img3.doubanio.com/lpic/s2414855.jpg",
      "url": "http://mr3.doubanio.com/b8c8ac11bd773fd2e5cb0c873648515e/0/fm/song/p378_128k.mp4", "station_id": ["1"], "genre": [], "__v": 0
    }, {
      "_id": "5a0993e801136eecb5bad6ae", "provider": "spotify", "title": "a maria santissima", "sid": "154",
      "artist": "achillea", "album": "amadas estrellas",
      "album_art": "https://img1.doubanio.com/lpic/s3225289.jpg",
      "url": "http://mr3.doubanio.com/24ad4555117d7a4b5c4fd7ebb9f7e624/0/fm/song/p154_128k.mp4", "station_id": ["1"], "genre": [], "__v": 0
    }]
    console.log('[fmract store] search params: ' + JSON.stringify(params))

    if(true){ // switch to use the temp data or server data
      scb(defaultSongs)
      return
    }

    var requestPath = 'v1/search?'
    var paramString = ''
    
    if(!params) {
      console.log('[fmreact store] seach for random data.')//TODO
      requestPath = 'v1/play_now'
    } else {
      params.title && (paramString += '&title=' + params.title)
      params.artist && (paramString += '&artist=' + params.artist)
      params.album && (paramString += '&album=' + params.album)
      params.genre && (paramString += '&genre=' + params.genre)
      params.station && (paramString += '&station=' + params.station)
      paramString = paramString.substring(1)
    }

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (response) => {
      console.log(response.currentTarget.response)
      response && response.currentTarget && scb(response.currentTarget.response)
    })
    xhr.addEventListener('error', (response) => {
      console.log('XMLHttpRequest error: ' + serverAdress + requestPath + paramString)
      ecb([])
    })
    xhr.responseType = 'json'
    xhr.open('GET', serverAdress + requestPath + paramString, true )
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
    xhr.send()
  }

  var audiosData = {
    fetchPlaylist: fetchPlaylist,
    fetchAudios: fetchAudios
  };

  return audiosData;

}());