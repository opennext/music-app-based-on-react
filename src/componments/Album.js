import React, { Component } from 'react'

class Album extends Component {
  constructor(props) {
    super(props)
    console.log(111111)
  }
  render() {
    return (
      <div style={{color:'red'}}>Album View</div>
    )
  }
}

export default Album