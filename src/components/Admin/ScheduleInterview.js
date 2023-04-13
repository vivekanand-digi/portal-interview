// Packages
import React, { useState } from 'react'
import { Form, Input, Button, DatePicker, TimePicker } from 'antd'
const { RangePicker } = TimePicker
// Styles
import styles from '../../styles/create_admin.module.css'

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

function ScheduleInterview() {
  const [form] = Form.useForm()
  const [interviewDate, setInterviewDate] = useState()
  const [interviewTime, setInterviewTime] = useState([])

  const onFinish = (values) => {
    values['interviewDate'] = interviewDate
    values['interviewTime'] = interviewTime
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      name='create_interviewer_form'
      onFinish={onFinish}
      scrollToFirstError
      className={styles.create_admin_form}
    >
      <Form.Item
        name='interviewerId'
        label='Interviewer Id'
        rules={[
          {
            required: true,
            message: 'Please provide Interviewer Id'
          }
        ]}
      >
        <Input />
      </Form.Item>

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
        <Input />
      </Form.Item>

      <Form.Item
        name='candidateId'
        label='Candidate Id'
        rules={[
          {
            required: true,
            message: 'Please provide candidate Id'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name='candidateName'
        label='Candidate Name'
        rules={[
          {
            required: true,
            message: 'Please provide candidate Name !'
          }
        ]}
      >
        <Input />
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
        <DatePicker onChange={(date, dateString) => setInterviewDate(dateString)} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name='interviewTime'
        label='Interview Time'
        rules={[
          {
            required: true,
            message: 'Please Enter Interview Time'
          }
        ]}
      >
        <RangePicker onChange={(date, dateString) => setInterviewTime(dateString)} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name='invitationLink'
        label='Invitation Link'
        rules={[
          {
            required: true,
            message: 'Please Enter valid invitation link'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type='primary' htmlType='submit'>
          Schedule Interview
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ScheduleInterview
