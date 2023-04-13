// Packages
import React, { useContext } from 'react'

import { withRouter } from 'react-router-dom'

import { Button, Image, Typography } from 'antd'
import { AzureAD } from 'react-aad-msal'
import { authProvider } from '../AdLogin/authProvider'
import styles from '../../styles/login.module.css'

// Context
import { RootContext } from '../../Context/RootContext'

// Style
import style from '../../styles/header.module.css'

// utils
import { clearAllFromLocal, getFromLocal, removeFromLocal, setCookie } from '../../utils/storage/index'
import Logo from '../../assets/DigiSprint-Logo.png'
import { microsoftLoginPath } from '../../Constants/constants'

function Header() {
  const { Title } = Typography
  const { isLogedIn, setIsLogedIn, userName, setuserName } = useContext(RootContext)
  const microsoftToken = getFromLocal('msal.ba6f6865-88a9-43b7-ac2b-b002b3168225.idtoken')

  const logoutFromMicrosoft = () => {
    setIsLogedIn(false)
    setuserName(null)
    removeFromLocal('user_loged_in')
    removeFromLocal('userName')
    removeFromLocal('id')
    sessionStorage.clear()
    setCookie('token', '', 0)
    clearAllFromLocal()
    window.location.href = '/'
  }

  return (
    <div className={style.header_wrapper + ' d-flex justify-content-md-between'}>
      <Image src={Logo} preview={false} alt='logo' />

      <div className={style.header_btn_wrapper}>
        {(isLogedIn || getFromLocal('user_loged_in')) && (
          <Title className={style.text_overflow_ellipsis} level={4}>{`Hello ${userName || getFromLocal('userName')}`}</Title>
        )}
        {microsoftToken && getFromLocal('user_loged_in') ? (
          <AzureAD provider={authProvider} forceLogin={false}>
            {({ logout }) => {
              return (
                <div className='col-6 d-flex justify-content-center col-md-auto'>
                  <button className={styles.microsoft_logout} onClick={logout}>
                    <div
                      onClick={() => {
                        logoutFromMicrosoft()
                      }}
                    >
                      <img className={styles.microsoft_logo} alt='svgImg' src={microsoftLoginPath} /> Sign out
                    </div>
                  </button>
                </div>
              )
            }}
          </AzureAD>
        ) : getFromLocal('external') === 'true' ? (
          <Button
            href='/'
            className={style.header_btn_logout}
            shape='round'
            size='large'
            onClick={() => {
              logoutFromMicrosoft()
            }}
          >
            Log out
          </Button>
        ) : null}
      </div>
    </div>
  )
}

export default withRouter(Header)
