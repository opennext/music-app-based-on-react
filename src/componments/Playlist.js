import React from 'react'
import {Focusable} from '../react-tv.js'
import './Playlist.css'

const Playlist = ({ playlist,onItemSelected }) => (
  <div>
    {playlist.audios && playlist.audios.map((audio, i) =>
      <Focusable name={'focusable-item-' + i} className='item' key={audio.i} onSelected={() => onItemSelected(audio)}>
        <div className='title'>{audio.title}</div>
        <div className='artist'>{audio.artist}</div>
      </Focusable>
    )}
  </div>
)

export default Playlist