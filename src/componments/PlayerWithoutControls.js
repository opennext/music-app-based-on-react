/**
 * PlayerWithoutControls.js, it is the Audio Player base H5 audio, using wrappper based on react componment.
 *
 * In the music-app-based-on-react project, it is replaced with public\common\playerWrapper.js.
 * 
 */


import React, { Component } from 'react'
import PropTypes from 'prop-types'

// see https://github.com/justinmc/react-audio-player/blob/master/src/index.jsx

class PlayerWithoutControls extends Component {
  render() {
    const incompatibilityMessage = this.props.children || (<p>Your browser does not support the <code>audio</code> element.</p>)
    return (
      // the no UI player does NOT need to set style / class / title.
      <audio 
        autoPlay={this.props.autoPlay}
        controls={false} // Set controls to be false
        loop={this.props.loop}
        muted={this.props.muted}
        preload={this.props.preload}
        ref={(ref) => { this.audioEl = ref }}
        src={this.props.src}
      >
        {incompatibilityMessage}
      </audio>
    )
  }

  componentDidMount() {
    ['canplay', 'canplaythrough', 'loadedmetadata', 'loadeddata', 'playing', 'play', 'pause', 'abort', 'waiting', 'timeupdate', 'progress', 'ended', 'seeked', 'error'].forEach((eventName) => {
      let handerName = 'on' + eventName.substring(0, 1).toUpperCase() + eventName.substring(1);
      this.props[handerName] && this.audioEl.addEventListener(eventName, (e) => {
        this.props[handerName](e)
      })
    })
  }
}

PlayerWithoutControls.defaultProps = {
  autoPlay: false,
  children: null,
  listenInterval: 10000,
  loop: false,
  muted: false,
  preload: 'metadata',
  src: null,
}

PlayerWithoutControls.propTypes = {
  autoPlay: PropTypes.bool,
  children: PropTypes.element,
  controls: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  onAbort: PropTypes.func,
  onCanPlay: PropTypes.func,
  onCanPlayThrough: PropTypes.func,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onPause: PropTypes.func,
  onPlay: PropTypes.func,
  onSeeked: PropTypes.func,
  onLoadedMetadata: PropTypes.func,
  onTimeupdate: PropTypes.func,
  onProgress: PropTypes.func,
  preload: PropTypes.oneOf(['', 'none', 'metadata', 'auto']),
  src: PropTypes.string, // Not required b/c can use <source>
}

export default PlayerWithoutControls