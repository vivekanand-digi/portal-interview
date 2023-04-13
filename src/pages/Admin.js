import React from 'react'
import Adnin from '../components/Admin/Candidate'
import Styles from '../styles/admin.module.css'
import { PageTitle } from '../components/atoms/page-title/page-title'

function index() {
  return (
    <div className={Styles.admin_wrapper}>
      <PageTitle>Admin Page</PageTitle>
      <Adnin />
    </div>
  )
}

export default index
