import React from 'react'

import Interviewer from '../components/Interviewer/Interviewer'
import Styles from '../styles/create_interviewer.module.css'
import { PageTitle } from '../components/atoms/page-title/page-title'

function index() {
  return (
    <div className={Styles.create_interview_wrapper}>
      <PageTitle>Interviewer Page</PageTitle>
      <Interviewer />
    </div>
  )
}

export default index
