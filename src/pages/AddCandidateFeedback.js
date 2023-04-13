// Packages
import React from 'react'
import { useParams, withRouter } from 'react-router-dom'
import { PageTitle } from '../components/atoms/page-title/page-title'

// View
import CandidateFeedbackForm from '../components/Candidate/CandidateFeedbackForm'

function AddCandidateFeedback(props) {
  const { candidate_id } = useParams()
  const from = props.location.state

  return (
    <div className='edit_candidate_wrapper'>
      <PageTitle>Add Candidate Feedback</PageTitle>
      <CandidateFeedbackForm id={candidate_id} from={from} />
    </div>
  )
}

export default withRouter(AddCandidateFeedback)
