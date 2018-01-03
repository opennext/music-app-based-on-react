import React, { Component } from 'react'
import { Focusable } from '../react-tv.js'

import { Toast } from './Common'
import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className='login'>
        <div className='logo'>Ambient Music</div>
        <div className='login-bg' style={{ backgroundImage: 'url(./images/music.jpg)' }}>
        </div>
        <div className='form'>
          <Focusable name='focusable-0' initialFocus={true} onFocused={() => this.idInput.focus()} className='container'>
            <input ref={(idInput) => { this.idInput = idInput }} className='input-box' placeholder='ID' />
          </Focusable>
          <Focusable name='focusable-1' onFocused={() => this.passwordInput.focus()} className='container'>
            <input ref={(passwordInput) => { this.passwordInput = passwordInput }} type='password' className='input-box' placeholder='Password' />
          </Focusable>
          <Focusable name='focusable-2' onSelected={() => {
            this.setLoginData()
          }} className='container'>
            <div className='logo-button'>LOGIN</div>
          </Focusable>
          {this.state.showToast && <Toast style={{ position: 'absolute', top: '300px', left: '760px' }}>{this.state.toastText}</Toast>}
        </div>
      </div>
    )
  }
  setLoginData() {
    let sucessFlag = false
    if(!!this.idInput.value && !!this.passwordInput.value) {
      sucessFlag =  true
      // widgetdata.write({
      //   id: this.idInput.value,
      //   password: this.passwordInput.value
      // })
    }
    setTimeout(() => {
      this.setState({
        showToast: false
      })
      sucessFlag && this.props.loginedCallback()// enter player page
    }, 2000)
    this.setState({
      toastText: sucessFlag ? 'Login Sucess, Loading...' : 'ID and Password is mandatory!',
      showToast: true
    })
  }
}

export default Login