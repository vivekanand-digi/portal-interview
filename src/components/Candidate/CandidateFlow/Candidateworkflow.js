import React, { Component } from 'react'
import { get, isEmpty } from 'lodash'
import ProgressBar from './Progressbar'
import { Col, message, Modal, Row } from 'antd'
import { Button } from '../../../components/atoms/button/button'
import { urls } from '../../../services/URLs'
import { requestPost, request } from '../../../services/request'
import ScheduleInterview from './ScheduleInteview'
import CandidateFeedback from './AddFeedback'
import { getFromLocal } from '../../../utils/storage/index'
import { RejectFeedback } from './RejectFeedback'
import { InterviewerModal } from './InterviewerModal'
import { DateModal } from './DateModal'
import styles from '../../../styles/candidate-workflows.module.css'

class Candidateworkflow extends Component {
  constructor(props) {
    super(props)
    this.globalSelectorId = getFromLocal('user_id') || ''
    this.globalSelectorName = getFromLocal('userName') || ''
    this.state = {
      showInterviewModal: false,
      showFeedbackModal: false,
      showRescheduleInterviewModal: false,
      interviewStartTime: null,
      interviewDate: null,
      interviewDuration: '30',
      candidate: {},
      interViewerId: null,
      feedbackComments: '',
      RoundStatus: null,
      interViewerList: [],
      hrList: [],
      carboncopyto: null,
      criteriaGroup: '',
      toggleHrModal: false,
      showRejectModal: false,
      offerRejectModal: false,
      offerRejectModalAction: '',
      rejectModalAction: '',
      additionalInterviewers: [],
      ccemailsList: [],
      interviewerModal: false,
      joiningDate: '',
      dateModal: false,
      statusUrl:''
    }
  }

  setJoiningDate = (date) => {
    this.setState({ joiningDate: 'Joining Date: ' + date.toISOString().slice(0, 10).replace(/-/g, '-') })
  }

  getinterviewlist = async () => {
    const finalurl = '/' + get(urls[0], 'INTERVIEWER')
    const res = await request(finalurl)
    this.setState({
      interViewerList: res.data
    })
  }

  getHrList = async () => {
    const finalUrl = `/${get(urls[0], 'INTERVIEWER')}/hrs`
    const res = await request(finalUrl)
    this.setState({
      hrList: res.data
    })
  }

  OpenshowRescheduleInterviewModal = () => {
    this.setState({
      showRescheduleInterviewModal: true
    })
  }
  OpenScheduleInterviewModal = () => {
    this.setState({
      showInterviewModal: true
    })
  }
  OpenFeedbackModal = () => {
    this.setState({
      showFeedbackModal: true
    })
  }
  showHrModal = () => {
    this.setState({
      toggleHrModal: true
    })
  }
  handleOkFeedback = () => {
    this.setState({
      showFeedbackModal: false
    })
  }
  handleOkReschedule = () => {
    this.setState({
      showRescheduleInterviewModal: false
    })
  }

  handleOk = () => {
    this.setState({
      showInterviewModal: false,
      toggleHrModal: false
    })
  }
  OnRescheduleInterview = () => {
    this.OpenshowRescheduleInterviewModal()
  }

  ButtonOnHoldAndDrop = (id, actionStatus, role, nextSteps) => {
    if (role == 'admin') {
      return (
        <div className={styles.onhold_drop_button}>
          {nextSteps.includes('Drop') ? (
            <Button
              className='ant-btn-dangerous'
              onClick={() => this.globalWorkflowHandler(id, actionStatus, '', '', '', '', get(urls[1], 'DROP_WORK_FLOW'))}
            >
              Drop
            </Button>
          ) : null}
          {nextSteps.includes('OnHold') ? (
            <Button
              className='ant-btn-pause'
              onClick={() => this.globalWorkflowHandler(id, actionStatus, '', '', '', '', get(urls[1], 'ON_HOLD_WORK_FLOW'))}
            >
              On Hold
            </Button>
          ) : null}
        </div>
      )
    } else {
      return null
    }
  }

  progressButton = (status, Action, id, role, isMatchedInterviewerId, enableFeedbackButtons, interviewerId, interviewerName) => {
    const isHr = getFromLocal('isHr') || false
    const isSelector = getFromLocal('selector') || false
    let onHoldStatus = false
    if (status.includes('OnHold')) {
      onHoldStatus = true
    }
    switch (onHoldStatus ? 'OnHold' : status) {
      case 'Applied':
        return (
          role === 'admin' && (
            <>
              <Button
                onClick={() => {
                  this.setState({ showRejectModal: true, rejectModalAction: 'AdminReject' })
                }}
              >
                Admin Reject
              </Button>
              <Button
                onClick={() => {
                  this.setState({ interviewerModal: true })
                }}
              >
                Assign Selector
              </Button>
            </>
          )
        )
      case 'PendingShortList':
        return (
          isMatchedInterviewerId &&
          isSelector && (
            <>
              <Button onClick={() => this.globalWorkflowHandler(id, 'ShortListed', '', interviewerId, interviewerName, '', '')}>
                Shortlist
              </Button>{' '}
              <Button onClick={() => this.setState({ showRejectModal: true, rejectModalAction: 'NotShortListed' })}>Reject</Button>
            </>
          )
        )
      case 'ShortListed':
        return (
          role === 'admin' && (
            <>
              <Button
                onClick={() => {
                  this.OpenScheduleInterviewModal()
                }}
              >
                Schedule Round 1
              </Button>
              <Button
                onClick={() => {
                  this.setState({ showRejectModal: true, rejectModalAction: 'skipAction',statusUrl:'skipAction' })
                }}
              >
                Skip This
              </Button>
            </>
          )
        )
      case 'NotShortListed':
        return ''
      case 'ScheduleRound1':
        return (
          ((isMatchedInterviewerId && role === 'interviewer') || (isMatchedInterviewerId && role === 'admin')) && (
            <>
              <Button
                disabled={!enableFeedbackButtons}
                onClick={() => {
                  this.OpenFeedbackModal()
                }}
              >
                Add Feedback
              </Button>
            </>
          )
        )
      case 'RescheduleRound1':
        return (
          ((isMatchedInterviewerId && role === 'interviewer') || (isMatchedInterviewerId && role === 'admin')) && (
            <>
              <Button
                disabled={!enableFeedbackButtons}
                onClick={() => {
                  this.OpenFeedbackModal()
                }}
              >
                Add Feedback
              </Button>
            </>
          )
        )
      case 'SelectedRound1':
        return (
          role === 'admin' && (
            <>
              <Button
                onClick={() => {
                  this.OpenScheduleInterviewModal()
                }}
              >
                Schedule Round 2
              </Button>
              <Button
                onClick={() => {
                  this.setState({ showRejectModal: true, rejectModalAction: 'skipAction',statusUrl:'skipAction' })
                }}
              >
                Skip This
              </Button>
            </>
          )
        )
      case 'NotSelectedRound1':
        return ''
      case 'ScheduleRound2':
        return (
          ((isMatchedInterviewerId && role === 'interviewer') || (isMatchedInterviewerId && role === 'admin')) && (
            <>
              <Button
                disabled={!enableFeedbackButtons}
                onClick={() => {
                  this.OpenFeedbackModal()
                }}
              >
                Add Feedback
              </Button>
            </>
          )
        )
      case 'RescheduleRound2':
        return (
          ((isMatchedInterviewerId && role === 'interviewer') || (isMatchedInterviewerId && role === 'admin')) && (
            <>
              <Button
                disabled={!enableFeedbackButtons}
                onClick={() => {
                  this.OpenFeedbackModal()
                }}
              >
                Add Feedback
              </Button>
            </>
          )
        )
      case 'SelectedRound2':
        return (
          role === 'admin' && (
            <>
              <Button
                onClick={() => {
                  this.showHrModal()
                }}
              >
                Schedule HR
              </Button>
            </>
          )
        )
      case 'NotSelectedRound2':
        return ''
      case 'ScheduledHr':
        return (
          ((isMatchedInterviewerId &&
          isHr) || role === 'admin') && (
            <>
              <Button
                disabled={!enableFeedbackButtons}
                onClick={() => {
                  this.OpenFeedbackModal()
                }}
              >
                Add Feedback
              </Button>
            </>
          )
        )
      case 'RescheduleHr':
        return (
          ((isMatchedInterviewerId &&
          isHr) || role === 'admin') && (
            <>
              <Button
                disabled={!enableFeedbackButtons}
                onClick={() => {
                  this.OpenFeedbackModal()
                }}
              >
                Add Feedback
              </Button>
            </>
          )
        )
      case 'Offered':
        return (
          (isHr || role=='admin') && (
            <>
              <Button
                onClick={() => {
                  this.setState({ dateModal: true })
                }}
              >
                Accepted offer
              </Button>
              <Button
                className='ant-btn-dangerous'
                onClick={() => {
                  this.setState({ showRejectModal: true, rejectModalAction: Action[0] })
                }}
              >
                Rejected offer
              </Button>
            </>
          )
        )
      case 'AcceptedOffer':
        return (
          role === 'admin' && (
            <div className={styles.joined_not_joined}>
              <Button
                className='ant-btn-hold'
                onClick={() => {
                  this.globalWorkflowHandler(id, 'Joined', '', '', '', '', '')
                }}
              >
                Joined
              </Button>
              <Button
                className='ant-btn-dangerous'
                onClick={() => {
                  this.setState({ offerRejectModal: true, offerRejectModalAction: 'NotJoined' })
                }}
              >
                Not Joined
              </Button>
            </div>
          )
        )
      case 'Joined':
        return (
          role === 'admin' && (
            <div className={styles.joined_not_joined}>
              <Button
                className='ant-btn-dangerous'
                onClick={() => {
                  this.setState({ offerRejectModal: true, offerRejectModalAction: 'Absconded' })
                }}
              >
                Terminate
              </Button>
            </div>
          )
        )
      case 'OnHold':
        return (
          role === 'admin' && (
            <div className={styles.joined_not_joined}>
              <Button
                className='ant-btn-hold'
                onClick={() => {
                  this.globalWorkflowHandler(id, 'reInitiateProfile', '', '', '', '', get(urls[1], 'REINITIATE_WORK_FLOW'))
                }}
              >
                ReInitiate
              </Button>
            </div>
          )
        )
        case 'ReEvaluateRound1':
        return (
          role === 'admin' && (
            <div className={styles.joined_not_joined}>
              <Button
                className='ant-btn-hold'
                onClick={() => {
                  this.OnRescheduleInterview()
                }}
              >
                Reschedule
              </Button>
            </div>
          )
        )
        case 'ReEvaluateRound2':
        return (
          role === 'admin' && (
            <div className={styles.joined_not_joined}>
              <Button
                className='ant-btn-hold'
                onClick={() => {
                  this.OnRescheduleInterview()
                }}
              >
                Reschedule
              </Button>
            </div>
          )
        )
        case 'ReEvaluateRoundHr':
        return (
          role === 'admin' && (
            <div className={styles.joined_not_joined}>
              <Button
                className='ant-btn-hold'
                onClick={() => {
                  this.OnRescheduleInterview()
                }}
              >
                Reschedule
              </Button>
            </div>
          )
        )
      default:
        return ''
    }
  }

  ReScheduleInterview = async (status) => {
    let payloadaction = ''
    if (status === 'ScheduleRound1' || status == 'RescheduleRound1' || status == "ReEvaluateRound1") {
      payloadaction = 'RescheduleRound1'
    }
    if (status === 'ScheduleRound2' || status == 'RescheduleRound2'|| status == "ReEvaluateRound2") {
      payloadaction = 'RescheduleRound2'
    }
    if (status === 'ScheduledHr' || status == 'RescheduleHr') {
      payloadaction = 'RescheduleHr'
    }

    try {
      const action = payloadaction
      const payload = {
        action: action,
        valueMap: {
          candidateId: this.props.candidate.id,
          interviewerId: this.state.interViewerId,
          interviewDate: this.state.interviewDate,
          interviewTime: this.state.interviewStartTime,
          timeTakenForInterview: Number(this.state.interviewDuration),
          criteriaGroup: this.state.criteriaGroup,
          additionalInterviewers: this.state.additionalInterviewers,
          ccemailsList: this.state.ccemailsList
        }
      }
      const finalurl = '/' + get(urls[1], 'WORK_FLOW')
      const res = await requestPost(finalurl, payload, 'post')
      if (res.status === 200) {
        this.props.setLoader(false)
        this.handleOk()
        this.handleOkReschedule()
      }
      this.setState({
        showInterviewModal: false
      })
      this.props.refreshtheCandidateData()
    } catch (ex) {
      message.error(ex)
      console.error(ex)
    }
  }

  ScheduleInterview = async (Nextaction) => {
    try {
      const action = Nextaction[0]
      const payload = {
        action: action,
        valueMap: {
          candidateId: this.props.candidate.id,
          interviewerId: this.state.interViewerId,
          interviewDate: this.state.interviewDate,
          interviewTime: this.state.interviewStartTime,
          timeTakenForInterview: Number(this.state.interviewDuration),
          criteriaGroup: this.state.criteriaGroup,
          additionalInterviewers: this.state.additionalInterviewers,
          ccemailsList: this.state.ccemailsList
        }
      }

      const finalurl = '/' + get(urls[1], 'WORK_FLOW')
      const res = await requestPost(finalurl, payload, 'post')
      if (res.status === 200) {
        this.props.setLoader(false)
        this.handleOk()
        this.handleOkReschedule()
      }
      this.setState({
        showRescheduleInterviewModal: false
      })
      this.props.refreshtheCandidateData()
    } catch (ex) {
      message.error(ex)
      console.error(ex)
    }
  }

  OnSubmitFeedack = async (val) => {
    const candidate = get(this.props, 'candidate')
    const candidateFeedback = get(candidate, 'candidateFeedback')
    try {
      const action = this.state.RoundStatus
      const extraPayload =
        action === 'NotSelectedRound1' || action === 'NotSelectedRound2' || action === 'NotOffered' || action === 'Offered' || action === "ReEvaluateRound1" || action === "ReEvaluateRound2" || action==="ReEvaluateRoundHr"
          ? {
              interviewerName: candidateFeedback.interviewerName,
              interviewerId: candidateFeedback.currentInterviewId
            }
          : {}
      const payload = {
        action: action,
        valueMap: {
          ...extraPayload,
          candidateId: this.props.candidate.id,
          feedBack: val,
          overAllFeedBack: this.state.feedbackComments
        }
      }
      const finalurl = '/' + get(urls[1], 'WORK_FLOW')
      await requestPost(finalurl, payload, 'post')
      this.setState({
        showFeedbackModal: false
      })
      this.props.refreshtheCandidateData()
    } catch (ex) {
      console.error(ex)
    }
  }

  onCancelCurrentStatus = async (status) => {
    const url = '/' + get(urls[1], 'WORK_FLOW')
    let finalUrl = url + '/' + get(urls[1], 'CANCEL_WORK_FLOW')
    const payload = {
      action: status,
      valueMap: {
        candidateId: this.props.candidate.id
      }
    }
    await requestPost(finalUrl, payload, 'post')
    this.props.refreshtheCandidateData()
  }

  acceptOrRejectOffer = async (nextaction) => {
    if (nextaction == 'RejectedOffer') {
      const result = confirm('Are you sure?')
      if (result) {
        this.setState({ showRejectModal: true, rejectModalAction: nextaction })
        return
      } else {
        return ''
      }
    }

    try {
      const action = nextaction
      const payload = {
        action: action,
        valueMap: {
          candidateId: this.props.candidate.id
        }
      }
      const finalurl = '/' + get(urls[1], 'WORK_FLOW')
      await requestPost(finalurl, payload, 'post')
      this.props.refreshtheCandidateData()
    } catch (ex) {
      message.error(ex)
      console.error(ex)
    }
  }

  interviewrChange = (e) => {
    this.setState({
      interViewerId: e
    })
  }
  interviewTimeChange = (time, timeString) => {
    this.setState({
      interviewStartTime: timeString
    })
  }
  interviewDatechange = (date, dateString) => {
    this.setState({
      interviewDate: dateString
    })
  }
  interviewDurationChange = (value) => {
    this.setState({
      interviewDuration: value
    })
  }
  addCarbonCopyTo = (value) => {
    this.setState({
      carboncopyto: value
    })
  }

  addFeedbackCriteria = (value) => {
    this.setState({
      criteriaGroup: value
    })
  }

  OnChangeRoundtatus = (e) => {
    this.setState({
      RoundStatus: e.target.value
    })
  }
  OnchangeFeedbackComments = (e) => {
    this.setState({
      feedbackComments: e.target.value
    })
  }

  checkForInterviewer = (id) => {
    const existingId = getFromLocal('user_id')
    if (existingId === id) {
      return true
    }
    return false
  }

  checkCurrentDateAndTime = (nextInterviewDate, nextInterviewTime) => {
    const timeStamp = `${nextInterviewDate} ${nextInterviewTime}`
    const date = new Date()
    const interviewDate = new Date(timeStamp)
    return date >= interviewDate
  }

  additionalValues = (value, ccList) => {
    this.setState({ additionalInterviewers: value.additionalInterviewers, ccemailsList: ccList })
  }

  statusAcceptedOrJoined = (role, status) => {
    if (status == 'AcceptedOffer') {
      return (
        <div className={styles.joined_not_joined}>
          <Button className='ant-btn-dangerous'>Not Joined</Button>
          <Button className='ant-btn-hold'>Joined</Button>
        </div>
      )
    } else if (status == 'Joined') {
      return (
        <div className={styles.joined_not_joined}>
          <Button className='ant-btn-dangerous'>Terminate</Button>
        </div>
      )
    }
  }

  globalWorkflowHandler = async (candidateId, action, feedback, interviewerId, interviewerName, selectorId, url) => {
    const payload = {}
    let finalurl = '/' + get(urls[1], 'WORK_FLOW')
    !isEmpty(action) ? (payload['action'] = action) : null
    if (!isEmpty(candidateId) || !isEmpty(feedback) || !isEmpty(interviewerId) || !isEmpty(interviewerName) || !isEmpty(selectorId)) {
      payload['valueMap'] = {}
    }
    !isEmpty(candidateId) ? (payload['valueMap']['candidateId'] = candidateId) : null
    !isEmpty(feedback) ? (payload['valueMap']['overAllFeedBack'] = feedback) : null
    !isEmpty(interviewerId) ? (payload['valueMap']['interviewerId'] = interviewerId) : null
    !isEmpty(interviewerName) ? (payload['valueMap']['interviewerName'] = interviewerName) : null
    !isEmpty(selectorId) ? (payload['valueMap']['selectorId'] = selectorId) : null
    finalurl = !isEmpty(url) ? finalurl + '/' + url : finalurl
    const res = await requestPost(finalurl, payload, 'post')
    this.setState({
      dateModal: false,
      joiningDate: '',
      interviewerModal: false,
      offerRejectModal: false,
      offerRejectModalAction: '',
      showRejectModal: false,
      rejectModalAction: '',
      statusUrl:''
    })
    this.props.refreshtheCandidateData()
  }

  render() {
    const candidate = get(this.props, 'candidate')
    const candidateFeedback = get(candidate, 'candidateFeedback')
    const actionValues = get(candidateFeedback, 'nextSteps')
    const { emails, setEmails } = this.props
    const role = getFromLocal('user_loged_in')
    const { status, currentInterviewId, nextInterviewDate, nextInterviewTime } = candidateFeedback
    const isMatchedInterviewerId = this.checkForInterviewer(currentInterviewId)
    const enableFeedbackButtons = this.checkCurrentDateAndTime(nextInterviewDate, nextInterviewTime)

    return (
      <>
        <Row gutter={[24, 24]} style={{ width: '100%' }}>
          <Col span={24}>
            {this.ButtonOnHoldAndDrop(candidate?.id, candidateFeedback?.status, role, candidateFeedback?.nextSteps || [])}
          </Col>
          <Col span={24}>
            {candidate && (
              <div style={{ height: 'auto' }}>
                <ProgressBar
                  rescheduleInterview={() => this.OnRescheduleInterview()}
                  candidateFeedback={candidateFeedback}
                  onCancelCurrentStatus={this.onCancelCurrentStatus.bind(this)}
                  role={role}
                />
              </div>
            )}
          </Col>
          <Col span={24}>
            {this.progressButton(
              candidateFeedback?.status,
              actionValues,
              candidate?.id,
              role,
              isMatchedInterviewerId,
              enableFeedbackButtons,
              candidateFeedback?.currentInterviewId,
              candidateFeedback?.interviewerName
            )}
          </Col>
        </Row>

        <div>
          {this.state.showInterviewModal ? (
            <Modal
              visible={true}
              onCancel={() => {
                this.handleOk()
              }}
              footer={[
                <Button key='back' onClick={() => this.handleOk()}>
                  cancel
                </Button>
              ]}
            >
              <ScheduleInterview
                interViewerList={this.state.interViewerList}
                getinterviewlist={this.getinterviewlist}
                onInterviewrChange={(e) => {
                  this.interviewrChange(e)
                }}
                onInterviewTimeChange={(time, timeString) => {
                  this.interviewTimeChange(time, timeString)
                }}
                onInterviewDateChange={(date, dateString) => {
                  this.interviewDatechange(date, dateString)
                }}
                onInterviewDurationChange={(e) => {
                  this.interviewDurationChange(e)
                }}
                onSubmitScheduleInterview={() => {
                  this.ScheduleInterview(actionValues)
                }}
                additionalValues={this.additionalValues}
                OnSelectCC={(e) => {
                  this.addCarbonCopyTo(e)
                }}
                OnSelectFeedbackCriteria={(e) => {
                  this.addFeedbackCriteria(e)
                }}
                previousData={candidateFeedback}
                emails={emails}
                setEmails={setEmails}
              />
            </Modal>
          ) : null}
          {this.state.toggleHrModal ? (
            <Modal
              visible={true}
              onCancel={() => {
                this.handleOk()
              }}
              footer={[
                <Button key='back' onClick={() => this.handleOk()}>
                  cancel
                </Button>
              ]}
            >
              <ScheduleInterview
                getinterviewlist={this.getHrList}
                interViewerList={this.state.hrList}
                onInterviewrChange={(e) => {
                  this.interviewrChange(e)
                }}
                onInterviewTimeChange={(time, timeString) => {
                  this.interviewTimeChange(time, timeString)
                }}
                onInterviewDateChange={(date, dateString) => {
                  this.interviewDatechange(date, dateString)
                }}
                onInterviewDurationChange={(e) => {
                  this.interviewDurationChange(e)
                }}
                onSubmitScheduleInterview={() => {
                  this.ScheduleInterview(actionValues)
                }}
                OnSelectCC={(e) => {
                  this.addCarbonCopyTo(e)
                }}
                OnSelectFeedbackCriteria={(e) => {
                  this.addFeedbackCriteria(e)
                }}
                additionalValues={this.additionalValues}
                previousData={candidateFeedback}
                emails={emails}
                setEmails={setEmails}
              />
            </Modal>
          ) : null}
          {this.state.showRescheduleInterviewModal ? (
            <Modal
              visible={true}
              onCancel={() => {
                this.handleOkReschedule()
              }}
              footer={[
                <Button key='back' onClick={() => this.handleOkReschedule()}>
                  cancel
                </Button>
              ]}
            >
              <ScheduleInterview
                getinterviewlist={this.getinterviewlist}
                interViewerList={this.state.interViewerList}
                onInterviewrChange={(e) => {
                  this.interviewrChange(e)
                }}
                onInterviewTimeChange={(time, timeString) => {
                  this.interviewTimeChange(time, timeString)
                }}
                onInterviewDateChange={(date, dateString) => {
                  this.interviewDatechange(date, dateString)
                }}
                onInterviewDurationChange={(e) => {
                  this.interviewDurationChange(e)
                }}
                additionalValues={this.additionalValues}
                onSubmitScheduleInterview={(values) => {
                  this.ReScheduleInterview(status, values)
                }}
                OnSelectCC={(e) => {
                  this.addCarbonCopyTo(e)
                }}
                OnSelectFeedbackCriteria={(e) => {
                  this.addFeedbackCriteria(e)
                }}
                previousData={candidateFeedback}
                RescheduleFlag={true}
                emails={emails}
                setEmails={setEmails}
              />
            </Modal>
          ) : null}
          <Modal
            width={'50%'}
            centered={true}
            visible={this.state.showFeedbackModal}
            onCancel={() => {
              this.handleOkFeedback()
            }}
            footer={[
              <Button key='back' onClick={() => this.handleOkFeedback()}>
                cancel
              </Button>
            ]}
          >
            <CandidateFeedback
              OnChangeRoundtatus={(e) => {
                this.OnChangeRoundtatus(e)
              }}
              NextactionValues={actionValues}
              OnchangeFeedbackComments={(e) => {
                this.OnchangeFeedbackComments(e)
              }}
              OnSubmitFeedack={(val) => {
                this.OnSubmitFeedack(val)
              }}
              criteriaGroup={candidateFeedback.criteriaGroup}
            />
          </Modal>
          {this.state.showRejectModal ? (
            <Modal
              visible={true}
              onCancel={() => this.setState({ showRejectModal: false, rejectModalAction: '',statusUrl:'' })}
              footer={[
                <div key={'Footer'}>
                  <Button
                    key='back'
                    onClick={() =>
                      this.globalWorkflowHandler(candidate?.id, this.state.rejectModalAction, this.state.feedbackComments, '', '', '', this.state.statusUrl)
                    }
                  >
                    submit
                  </Button>
                  <Button key='back' onClick={() => this.setState({ showRejectModal: false, rejectModalAction: '',statusUrl:'' })}>
                    cancel
                  </Button>
                </div>
              ]}
            >
              <RejectFeedback
                OnchangeFeedbackComments={(e) => {
                  this.OnchangeFeedbackComments(e)
                }}
              />
            </Modal>
          ) : null}
          {this.state.offerRejectModal ? (
            <Modal
              visible={true}
              onCancel={() => this.setState({ offerRejectModal: false, offerRejectModalAction: '' })}
              footer={[
                <div key={'Footer'}>
                  <Button
                    key='back'
                    onClick={() =>
                      this.globalWorkflowHandler(
                        candidate?.id,
                        this.state.offerRejectModalAction,
                        this.state.feedbackComments,
                        '',
                        '',
                        '',
                        ''
                      )
                    }
                  >
                    submit
                  </Button>
                  <Button key='back' onClick={() => this.setState({ offerRejectModal: false, offerRejectModalAction: '' })}>
                    cancel
                  </Button>
                </div>
              ]}
            >
              <RejectFeedback
                OnchangeFeedbackComments={(e) => {
                  this.OnchangeFeedbackComments(e)
                }}
              />
            </Modal>
          ) : null}
          {this.state.interviewerModal ? (
            <Modal
              visible={true}
              onCancel={() => this.setState({ interviewerModal: false })}
              footer={[
                <div key={'Footer'}>
                  <Button
                    key='back'
                    onClick={() => this.globalWorkflowHandler(candidate?.id, 'PendingShortList', '', '', '', this.state.interViewerId, '')}
                  >
                    submit
                  </Button>
                  <Button key='back' onClick={() => this.setState({ interviewerModal: false })}>
                    cancel
                  </Button>
                </div>
              ]}
            >
              <InterviewerModal
                interViewerList={this.state.interViewerList}
                getinterviewlist={this.getinterviewlist}
                onInterviewrChange={(e) => {
                  this.interviewrChange(e)
                }}
              />
            </Modal>
          ) : null}
          {this.state.dateModal ? (
            <Modal
              visible={true}
              onCancel={() => this.setState({ dateModal: false, joiningDate: '' })}
              footer={[
                <div key={'Footer'}>
                  <Button
                    disabled={!this.state.joiningDate}
                    key='back'
                    onClick={() => this.globalWorkflowHandler(candidate?.id, actionValues[1], this.state.joiningDate, '', '', '', '')}
                  >
                    submit
                  </Button>
                  <Button key='back' onClick={() => this.setState({ dateModal: false, joiningDate: '' })}>
                    cancel
                  </Button>
                </div>
              ]}
            >
              <DateModal setJoiningDate={this.setJoiningDate} />
            </Modal>
          ) : null}
        </div>
      </>
    )
  }
}

export default Candidateworkflow
