// Packages

import React, { useContext, useState, useEffect } from 'react'
import { Form, Input, Button, message, Spin, Checkbox } from 'antd'

// Styles
import styles from '../../styles/create_admin.module.css'

// Requests
import { request, requestPost } from '../../services/request'

// Context
import { RootContext } from '../../Context/RootContext'

import InterviewerLists from './InterviewerLists'
import EditInterviewer from '../Interviewer/EditInterviewer'

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

function InterviewerForm() {
  const [form] = Form.useForm()
  const { setInterviewerRecord } = useContext(RootContext)
  const [isload, setisload] = useState(false)
  const [isCheckedSelector, setIsCheckedSelector] = useState(false)
  const [isCheckedHr, setIsCheckedHr] = useState(false)
  const [isCheckedAdmin, setIsCheckedAdmin] = useState(false)
  const [isCheckedExternal, setIsCheckedExternal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [getAllInterviewerRecord, setGetAllInterviewerRecord] = useState([])
  const [dataBaseId, setDataBaseId] = useState('')

  useEffect(async () => {
    const res = await request('/interviewer')
    setGetAllInterviewerRecord(res.data)
  }, [])

  const callInterviewerWhenUpdate = async () => {
    const res = await request('/interviewer')
    setGetAllInterviewerRecord(res.data)
  }

  const onChange = (e, type) => {
    type === 'selector' && setIsCheckedSelector(e.target.checked)
    type === 'hr' && setIsCheckedHr(e.target.checked)
    type === 'admin' && setIsCheckedAdmin(e.target.checked)
    type === 'external' &&
      (setIsCheckedExternal(e.target.checked), setIsCheckedAdmin(false), setIsCheckedHr(false), setIsCheckedSelector(false))
  }

  const onFinish = async (values) => {
    const payload = {
      ...values,
      selector: isCheckedSelector,
      hr: isCheckedHr,
      admin: isCheckedAdmin,
      externalUser: isCheckedExternal
    }
    setisload(true)
    try {
      // message.loading('Action in progress..');
      let data = await requestPost('/createInterviewer', payload)
      setInterviewerRecord(data)
      console.log("dataaaaaaaaaaaaaaaaaaaaaaa",data)
      if (data.status === 200) {
        message.success('Interviewer created sucessfully')
      } else {
        let errorMsg = (
          data.data && data.data.message) || 'Failed to create interviewer'
        message.error(errorMsg)
      }
      form.resetFields()
      setIsCheckedSelector(false)
      setIsCheckedHr(false)
      setIsCheckedAdmin(false)
      setIsCheckedExternal(false)
      setisload(false)
      callInterviewerWhenUpdate()
    } catch (error) {
      message.error('Failed to create inteviwer')
      console.log(error)
      setisload(false)
      callInterviewerWhenUpdate()
    }
  }

  return (
    <Spin spinning={isload}>
      {!isEdit ? (
        <Form
          {...formItemLayout}
          form={form}
          name='create_interviewer_form'
          onFinish={onFinish}
          initialValues={{
            prefix: '91'
          }}
          scrollToFirstError
          className={styles.create_admin_form}
        >
          <Form.Item
            name='interviewerName'
            label='User Name'
            tooltip='Name of user'
            rules={[
              {
                required: true,
                message: 'Please Enter User Name!',
                whitespace: true
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='interviewerEmail'
            label='User E-mail'
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]}
          >
            <Input autoComplete='new-name' />
          </Form.Item>
          {isCheckedExternal && (
            <>
              <Form.Item
                name='interviewerPassword'
                label='password'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!'
                  }
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name='reEnterPassword'
                label='re enter password'
                dependencies={['interviewerPassword']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!'
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('interviewerPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'))
                    }
                  })
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          {!isCheckedExternal && (
            <>
              <Form.Item name='selector' label='Can Shortlist'>
                <Checkbox onChange={(e) => onChange(e, 'selector')} checked={isCheckedSelector}></Checkbox>
              </Form.Item>
              <Form.Item name='hr' label='HR'>
                <Checkbox onChange={(e) => onChange(e, 'hr')} checked={isCheckedHr}></Checkbox>
              </Form.Item>
              <Form.Item name='admin' label='Admin'>
                <Checkbox onChange={(e) => onChange(e, 'admin')} checked={isCheckedAdmin}></Checkbox>
              </Form.Item>
            </>
          )}
          <Form.Item name='External' label='External'>
            <Checkbox onChange={(e) => onChange(e, 'external')} checked={isCheckedExternal}></Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Create User
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <EditInterviewer id={dataBaseId} callInterviewerWhenUpdate={callInterviewerWhenUpdate} setIsEdit={setIsEdit} />
      )}
      <InterviewerLists setIsEdit={setIsEdit} getAllInterviewerRecord={getAllInterviewerRecord} setDataBaseId={setDataBaseId} />
    </Spin>
  )
}

export default InterviewerForm
