// Packages
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

// View
import App from './components/App'

// styles
import 'antd/dist/antd.css'
import './index.css'

// context
import RootProvider from './Context/RootProvider'

// Root element
const ROOT = document.getElementById('root')

// render
render(
  <BrowserRouter>
    <RootProvider>
      <App />
    </RootProvider>
  </BrowserRouter>,
  ROOT
)
