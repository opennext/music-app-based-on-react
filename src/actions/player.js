export const setAudio = (audio) => ({
  type: 'SET_AUDIO',
  audio
})

export const onPlayerEvent = (playingInfo) => ({
  type: 'ON_PLAYER_EVENT',
  playingInfo,
})