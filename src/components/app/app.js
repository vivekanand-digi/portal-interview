import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import RootProvider from '../../Context/RootProvider'
const InnerApp = React.lazy(() => import('../InnerApp'))
import 'antd/dist/antd.css'

export class App extends React.Component {
  constructor() {
    super()
    this.state = {
      mounted: false
    }
  }

  componentDidMount() {
    if (this.state && !this.state.mounted) {
      this.setState({ mounted: true })
    }
  }
  render() {
    return (
      <div>
        {this.state.mounted ? (
          <BrowserRouter>
            <RootProvider>
              <Suspense fallback={<div>Please Wait while Loading...</div>}>
                <InnerApp />
              </Suspense>
            </RootProvider>
          </BrowserRouter>
        ) : null}
      </div>
    )
  }
}
