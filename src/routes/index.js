// Login
import Login from '../pages/Login'
// Admin
import Admin from '../pages/Admin'
// Interviewer
import Interviewer from '../pages/Interviewer'
// EditCandidate
import EditCandidate from '../pages/EditCandidate'
// EditInterviewer
import EditInterviewer from '../pages/EditInterviewer'
//add candidate Feedback
import AddCandidateFeedback from '../pages/AddCandidateFeedback'

//view candidate
import ViewCandidate from '../components/Candidate/Viewcandidate'

export const routes = [
  {
    path: ['/', '/login'],
    component: Login,
    exact: true,
    isProtected: false
  },
  {
    path: '/admin/candidateList/:id',
    component: Admin,
    exact: true,
    isProtected: true
  },
  {
    path: '/admin/candidateCreate',
    component: Admin,
    exact: true,
    isProtected: true
  },
  {
    path: '/admin/manageSystemUsers',
    component: Admin,
    exact: true,
    isProtected: true
  },
  {
    path: '/admin/manageFeedbackCriteria',
    component: Admin,
    exact: true,
    isProtected: true
  },
  {
    path: '/admin/candidateList',
    component: Admin,
    exact: true,
    isProtected: true,
    isRedirect: true,
    redirectUrl: '/admin/candidateList/1'
  },
  {
    path: '/admin',
    component: Admin,
    exact: true,
    isProtected: true,
    isRedirect: true,
    redirectUrl: '/admin/candidateList/1'
  },

  {
    path: '/interviewerClient',
    component: Interviewer,
    exact: true,
    isProtected: true
  },
  {
    path: '/admin/edit_candidate/:candidate_id',
    component: EditCandidate,
    exact: true,
    isProtected: true
  },
  {
    path: '/admin/edit_interviewer/:interviewer_id',
    component: EditInterviewer,
    exact: true,
    isProtected: true
  },
  {
    path: '/interviewer/edit_candidate/:candidate_id',
    component: EditCandidate,
    exact: true,
    isProtected: true
  },
  {
    path: '/interviewer/Addfeedback_candidate/:candidate_id',
    component: AddCandidateFeedback,
    exact: true,
    isProtected: true
  },
  {
    path: '/viewcandidate/:candidate_id',
    component: ViewCandidate,
    exact: true,
    isProtected: true
  }
]
