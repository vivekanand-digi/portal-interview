import Candidate from '../components/Candidate/Candidate'
import React from 'react'
import { PageTitle } from '../components/atoms/page-title/page-title'

function index() {
  return (
    <div className='candidate-wrapper'>
      <PageTitle>Candidate Page</PageTitle>
      <Candidate />
    </div>
  )
}

export default index
