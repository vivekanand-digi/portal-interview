// Packages
import React from 'react'
import { useParams, withRouter } from 'react-router-dom'

// View
import EditCandidateComponenet from '../components/Candidate/EditCandidate'
import { PageTitle } from '../components/atoms/page-title/page-title'

function EditCandidate(props) {
  const { candidate_id } = useParams()
  const from = props.location.state

  return (
    <div className='edit_candidate_wrapper'>
      <PageTitle>Edit Candidate Page</PageTitle>
      <EditCandidateComponenet id={candidate_id} from={from} />
    </div>
  )
}

export default withRouter(EditCandidate)
