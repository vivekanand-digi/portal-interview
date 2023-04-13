// packages
import { Switch, Route, Redirect } from 'react-router-dom'

import { Affix, Layout } from 'antd'
const { Header, Footer, Content } = Layout

// All Routes
import { routes } from '../routes'
import PublicRoute from '../routes/PublicRoute'
import PrivateRoute from '../routes/PrivateRoute'

// Views
import HeaderComponent from './Header/Header'
import FooterComponent from './Footer/Footer'
import NotFound from '../components/Authorization/404'
import React from 'react'

// style
import styles from './style.module.css'
import 'antd/dist/antd.css'
import '../index.css'

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.app_wrapper}>
        <Layout>
          <Affix offsetTop={0}>
            <Header className={styles.app_header}>
              <HeaderComponent />
            </Header>
          </Affix>

          <Content>
            <Switch>
              {routes.map(({ component, exact, path, isProtected, isRedirect, redirectUrl }, index) => {
                return isProtected && isRedirect == true ? (
                  <PrivateRoute exact={exact} path={path} key={index} component={() => <Redirect to={redirectUrl} />} />
                ) : isProtected ? (
                  <PrivateRoute exact={exact} path={path} key={index} component={component} />
                ) : (
                  <PublicRoute exact={exact} path={path} key={index} component={component} />
                )
              })}
              <Route path='*' component={NotFound} />
            </Switch>
          </Content>
          <Footer>
            <FooterComponent />
          </Footer>
        </Layout>
      </div>
    )
  }
}
