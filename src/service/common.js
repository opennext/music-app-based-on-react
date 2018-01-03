function getFullTime(time) {
  return time < 10 ? '0' + time : time
}

const timeToMMSS = (time) => {
  return getFullTime(new Date(time).getMinutes()) + ':' + getFullTime(new Date(time).getSeconds())
}

export {
  timeToMMSS,
}