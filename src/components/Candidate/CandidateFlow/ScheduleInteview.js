// Packages
import React, { useState, useEffect } from 'react'
import { Form, Select, DatePicker, TimePicker } from 'antd'
import { Button } from '../../../components/atoms/button/button'
import { request } from '../../../services/request'
import { isEmpty } from 'lodash'
import moment from 'moment'
import MultiEmailInput from './ReactMultiEmail'

const { Option } = Select

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
}

function ScheduleInterview(props) {
  const [form] = Form.useForm()
  const [criteriaGroup, setcriteriaGroup] = useState(null)
  const [selectedDate, setselectedDate] = useState('')
  const [disableButton, setDisableButton] = useState(false)

  useEffect(() => {
    const preInfo = props.previousData
    const PreviousInterviewData = {
      interviewDate: preInfo.nextInterviewDate || '',
      interviewTime: preInfo.nextInterviewTime || '',
      intervieweDuration: preInfo.timeTakenForInterview || '',
      interviewerId: preInfo.currentInterviewId || '',
      FeedBackCriteria: preInfo.criteriaGroup || ''
    }
    if (props.RescheduleFlag) {
      props.onInterviewrChange(preInfo.currentInterviewId)
      props.onInterviewDateChange(moment(preInfo.nextInterviewDate), preInfo.nextInterviewDate)
      props.onInterviewTimeChange(moment(preInfo.nextInterviewTime), preInfo.nextInterviewTime)
      props.onInterviewDurationChange(preInfo.timeTakenForInterview)
      props.OnSelectFeedbackCriteria(preInfo.criteriaGroup)

      if (preInfo.nextInterviewDate) {
        form.setFieldsValue({
          interviewDate: moment(PreviousInterviewData.interviewDate),
          interviewTime: moment(PreviousInterviewData.nextInterviewTime),
          interviewerName: PreviousInterviewData.interviewerId,
          intervieweDuration: PreviousInterviewData.interviewDuration,
          FeedBackCriteria: PreviousInterviewData.FeedBackCriteria
        })
      }
    }
    props.getinterviewlist()
  }, [])

  useEffect(async () => {
    const res = await request('/criteriaGroup')
    if (res.data) {
      setcriteriaGroup(res.data)
    }
  }, [])

  const onFinish = (values) => {
    props.additionalValues(values, props.emails)
    setDisableButton(true)
    props.onSubmitScheduleInterview()
  }

  const getInteviewerList = props?.interViewerList?.map((value, key) => {
    return (
      <>
        {value.externalUser === true ? null : (
          <Option id={key} value={value.id}>
            {value.interviewerName}-{value.interviewerEmail}
          </Option>
        )}
      </>
    )
  })

  const getAdditionalInterviewerList = props?.interViewerList?.map((value, key) => {
    return (
      <>
        {value.externalUser === true ? null : (
          <Option id={key} value={value.interviewerEmail}>
            {value.interviewerName}-{value.interviewerEmail}
          </Option>
        )}
      </>
    )
  })
  const getCriteriaGroup =
    !isEmpty(criteriaGroup) &&
    criteriaGroup.map((value, key) => {
      return (
        <Option key={key} id={key} value={value.id}>
          {value.id}
        </Option>
      )
    })

  let hourArray = []
  if (selectedDate !== '') {
    const date = new Date()
    if (
      date.getDay() == selectedDate.getDay() &&
      date.getMonth() == selectedDate.getMonth() &&
      date.getFullYear() == selectedDate.getFullYear()
    ) {
      const currentHour = date.getHours()
      for (let i = 0; i < currentHour; i++) {
        hourArray.push(i)
      }
    }
  }

  return (
    <Form {...formItemLayout} form={form} name='schedule_interview_form' onFinish={onFinish} scrollToFirstError style={{ width: '90%' }}>
      <Form.Item
        name='interviewerName'
        label='Interviewer Name'
        rules={[
          {
            required: true,
            message: 'Please provide Interviewer Name !'
          }
        ]}
      >
        <Select
          placeholder='Please Select Interviewer'
          onChange={(e) => {
            props.onInterviewrChange(e)
          }}
        >
          {getInteviewerList}
        </Select>
      </Form.Item>

      <Form.Item name='additionalInterviewers' label='Additional Interviewers'>
        <Select mode='multiple' allowClear style={{ width: '100%' }} placeholder='Please select' defaultValue={[]}>
          {getAdditionalInterviewerList}
        </Select>
      </Form.Item>

      <Form.Item name='ccemailsList' label='CC List'>
        <MultiEmailInput emails={props.emails} setEmails={props.setEmails} />
      </Form.Item>
      <Form.Item
        name='interviewDate'
        label='Interview Date'
        rules={[
          {
            required: true,
            message: 'Please Enter Interview Date'
          }
        ]}
      >
        <DatePicker
          onChange={(date, dateString) => {
            setselectedDate(date._d)
            props.onInterviewDateChange(date, dateString)
          }}
          style={{ width: '100%' }}
          disabledDate={(current) => {
            return moment().add(-1, 'days') >= current
          }}
        />
      </Form.Item>

      <Form.Item
        name='interviewTime'
        label='Interview Start Time'
        rules={[
          {
            required: true,
            message: 'Please Enter Interview Start Time'
          }
        ]}
      >
        <TimePicker
          disabledHours={() => hourArray}
          onChange={(time, timeString) => props.onInterviewTimeChange(time, timeString)}
          style={{ width: '100%' }}
          minuteStep={15}
          secondStep={60}
        />
      </Form.Item>
      <Form.Item
        name='intervieweDuration'
        label='interviewe Duration'
        rules={[
          {
            required: true,
            message: 'Please provide Interviewe Duration'
          }
        ]}
      >
        <Select
          placeholder='Please select'
          onChange={(e) => {
            props.onInterviewDurationChange(e)
          }}
        >
          <Option value='15'>15 min</Option>
          <Option value='30'>30 min</Option>
          <Option value='45'>45 min</Option>
          <Option value='60'>60 min</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name='FeedBackCriteria'
        label='Feedback Criteria'
        rules={[
          {
            required: true,
            message: 'Please select Feedback Criteria'
          }
        ]}
      >
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder='Please select'
          onChange={(e) => {
            props.OnSelectFeedbackCriteria(e)
          }}
        >
          {getCriteriaGroup}
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type='primary' htmlType='submit' disabled={disableButton}>
          Schedule Interview
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ScheduleInterview
