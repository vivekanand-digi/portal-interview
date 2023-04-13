import React from 'react'
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Steps, Tooltip } from 'antd'
import { Button } from '../../../components/atoms/button/button'
const { Step } = Steps
import { get, isEmpty } from 'lodash'
import { stepStatus, UpcomingStatusTitle, HistoryStatusTitle } from '../../../Constants/constants'

function ProgressBar(props) {
  const status = props.candidateFeedback?.status || ''
  const { candidateFeedback, role } = props
  const { candidateHistory } = props.candidateFeedback
  const count = (candidateHistory && candidateHistory.length + 1) || 0

  let currentstatus = get(stepStatus, status)
  if (status.includes('Dropped')) {
    currentstatus = 'error'
  }
  const Title = get(UpcomingStatusTitle, status)

  const History =
    !isEmpty(candidateHistory) &&
    candidateHistory.map((value, key) => {
      const feedback = () => {
        if (!isEmpty(value.feedBack)) {
          let feedbackArray = []
          for (const key in value.feedBack) {
            feedbackArray.push(
              <p style={{ padding: '0px', margin: '0px' }} key={key}>
                {key}: {value.feedBack[key]}
              </p>
            )
          }
          return feedbackArray
        }
      }

      const descriptionElement = (
        <code>
          {value.interviewerName && <> Interviewer : {value.interviewerName} </>}
          {value.feedBack && (
            <>
              <br />
              <Tooltip placement='rightTop' title={feedback()}>
                Feedback <InfoCircleOutlined />{' '}
              </Tooltip>{' '}
            </>
          )}
          {value.overAllFeedBack && (
            <>
              {' '}
              <br /> overAll Feedback : {value.overAllFeedBack}{' '}
            </>
          )}
          {value.interviewDate && (
            <>
              {' '}
              <br /> Interview Date : {value.interviewDate}{' '}
            </>
          )}
          {value.interviewTime && (
            <>
              <br /> Interview Time : {value.interviewTime}{' '}
            </>
          )}
          <br />
        </code>
      )
      const historystatus = get(HistoryStatusTitle, value.roundStatus) || value.roundStatus
      return <Step key={key} title={historystatus} description={descriptionElement} status='finish' />
    })

  const currentStatus = (candidateFeedback, role) => {
    const feedback = () => {
      if (!isEmpty(candidateFeedback.feedBack)) {
        let feedbackArray = []
        for (const key in candidateFeedback.feedBack) {
          feedbackArray.push(
            <p style={{ padding: '0px', margin: '0px' }} key={key}>
              {key}: {candidateFeedback.feedBack[key]}
            </p>
          )
        }
        return feedbackArray
      }
    }

    const lastCandidateDescrption =
      (candidateFeedback.currentInterviewId && candidateFeedback.interviewerName) ||
      candidateFeedback.feedBack ||
      candidateFeedback.overAllFeedBack ||
      candidateFeedback.interviewDate ||
      candidateFeedback.interviewTime ? (
        <code>
          {(candidateFeedback.currentInterviewId && candidateFeedback.interviewerName && (
            <> Interviewer : {candidateFeedback.interviewerName} </>
          )) ||
            null}
          {(candidateFeedback.feedBack && (
            <Tooltip placement='rightTop' title={feedback()}>
              Feedback <InfoCircleOutlined />{' '}
            </Tooltip>
          )) ||
            null}
          {(candidateFeedback.overAllFeedBack && (
            <>
              {' '}
              <br /> overAll Feedback : {candidateFeedback.overAllFeedBack}{' '}
            </>
          )) ||
            null}
          {(candidateFeedback.interviewDate && (
            <>
              {' '}
              <br /> Interview Date : {candidateFeedback.interviewDate}{' '}
            </>
          )) ||
            null}

          {(candidateFeedback.interviewTime && (
            <>
              <br /> Interview Time : {candidateFeedback.interviewTime}{' '}
            </>
          )) ||
            null}

          <br />
          <br />
          {role === 'admin' &&
          (candidateFeedback.status === 'ScheduleRound1' ||
            candidateFeedback.status === 'ScheduleRound2' ||
            candidateFeedback.status === 'ScheduledHr' ) ? (
            <div>
              <Button onClick={() => props.rescheduleInterview()}>Reschedule</Button>
              <Button
                danger
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  props.onCancelCurrentStatus(status)
                }}
              >
                Cancel
              </Button>
            </div>
          ) : null}
          {role === 'admin' &&
          (candidateFeedback.status === 'RescheduleRound1' ||
            candidateFeedback.status === 'RescheduleRound2' ||
            candidateFeedback.status === 'RescheduleHr') ? (
            <div>
              <Button onClick={() => props.rescheduleInterview()}>Reschedule</Button>
              <Button
                danger
                style={{ marginLeft: '10px' }}
                onClick={() => {
                  props.onCancelCurrentStatus(status)
                }}
              >
                Cancel
              </Button>
            </div>
          ) : null}
          <br />
        </code>
      ) : null
    const historystatus = get(HistoryStatusTitle, candidateFeedback.status) || candidateFeedback.status
    return candidateFeedback.status && <Step status={currentstatus} title={historystatus} description={lastCandidateDescrption}></Step>
  }

  const nextStepsDescription = (
    <code>
      {candidateFeedback.nextInterviewDate && (
        <>
          <br />
          <p className='mb-0'>Upcoming Interview Date : {candidateFeedback.nextInterviewDate}</p>{' '}
        </>
      )}

      {candidateFeedback.nextInterviewTime && (
        <>
          <p className='mb-0'>Upcoming Interview Time : {candidateFeedback.nextInterviewTime}</p>{' '}
        </>
      )}
    </code>
  )

  return (
    <div>
      <Steps direction='vertical' current={count} status='error'>
        {History}
        {currentStatus(candidateFeedback, role)}
        {!isEmpty(candidateFeedback.nextSteps) && candidateFeedback.nextSteps[0] !== 'Absconded' && (
          <Step
            style={{ height: 'auto' }}
            status='In Progress'
            icon={<LoadingOutlined />}
            title={Title}
            description={nextStepsDescription}
          ></Step>
        )}
      </Steps>
    </div>
  )
}

export default ProgressBar
