import React, { Component } from 'react'
import './Common.css'

export class Toast extends Component {
  render() {
    return (
      <div {...this.props} className='toast'>
        {this.props.children}
      </div>
    )
  }
}