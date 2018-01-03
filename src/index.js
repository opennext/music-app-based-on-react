import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './componments/App'
import Album from './componments/Album'
import reducer from './reducers'

import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'

let audios = []

const store = createStore(reducer)

render(<Provider store={store}>
  <App store={store}/>
</Provider>, document.getElementById('root'))