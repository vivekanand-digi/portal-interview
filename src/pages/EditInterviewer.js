// Packages
import React, { useContext } from 'react'
import { useParams, withRouter } from 'react-router-dom'

// Context
import { RootContext } from '../Context/RootContext'

// View
import EditInterviewerComponenet from '../components/Interviewer/EditInterviewer'
import { PageTitle } from '../components/atoms/page-title/page-title'

function EditInterviewer() {
  const { interviewer_id } = useParams()
  const { interviewerRecord } = useContext(RootContext)

  return (
    <div className='edit_candidate_wrapper'>
      <PageTitle>Edit System User Page</PageTitle>
      <EditInterviewerComponenet id={interviewer_id} record={interviewerRecord.data} />
    </div>
  )
}

export default withRouter(EditInterviewer)
