import React from 'react'
import Login from '../components/Login/Login'
import styles from '../styles/login.module.css'
import { PageTitle } from '../components/atoms/page-title/page-title'

function index() {
  return (
    <div className={styles.login_wrapper}>
      <PageTitle>Login Page</PageTitle>
      <Login />
    </div>
  )
}

export default index
