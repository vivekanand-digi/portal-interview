// Packages
import React, { useEffect, useState } from 'react'
import { Form, Input, message, Checkbox } from 'antd'
import { Button } from '../../components/atoms/button/button'
import { ArrowLeftOutlined } from '@ant-design/icons'

// Styles
import styles from '../../styles/create_admin.module.css'
import { createRequest, request } from '../../services/request'
import { get } from 'lodash'
import { urls } from '../../services/URLs'

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

function EditInterviewer({ id, record, callInterviewerWhenUpdate, setIsEdit }) {
  const [form] = Form.useForm()
  const [initData, setinitData] = useState()
  const [isCheckedSelector, setIsCheckedSelector] = useState(false)
  const [isCheckedHr, setIsCheckedHr] = useState(false)
  const [isCheckedAdmin, setIsCheckedAdmin] = useState(false)
  const [isCheckedExternal, setIsCheckedExternal] = useState(false)

  const onFinish = async (values) => {
    const payload = {
      ...values,
      id,
      companyId: values.companyId,
      selector: isCheckedSelector,
      hr: isCheckedHr,
      admin: isCheckedAdmin,
      externalUser: isCheckedExternal
    }
    try {
      message.loading('Action in progress..')
      const response = await createRequest('/updateInterviewer', 'put', payload)
      if (response.status == 200) {
        message.success('Data saved successfully')
        callInterviewerWhenUpdate()
        setIsEdit(false)
      } else {
        let errorMsg = (response.data && response.data.message) || 'Failed to update interviewer'
        message.error(errorMsg)
      }
    } catch (error) {
      message.error('Some thing went wrong')
      console.log(error)
    }
  }

  const setInitialSelect = (type, data) => {
    type === 'selector' && setIsCheckedSelector(data)
    type === 'hr' && setIsCheckedHr(data)
    type === 'admin' && setIsCheckedAdmin(data)
    type === 'external' && setIsCheckedExternal(data)
  }

  const onChange = (e, type) => {
    type === 'selector' && setIsCheckedSelector(e.target.checked)
    type === 'hr' && setIsCheckedHr(e.target.checked)
    type === 'admin' && setIsCheckedAdmin(e.target.checked)
    type === 'external' &&
      (setIsCheckedExternal(e.target.checked), setIsCheckedAdmin(false), setIsCheckedHr(false), setIsCheckedSelector(false))
  }

  useEffect(() => {
    request('/' + get(urls[0], 'INTERVIEWER') + `/${id}`).then((res) => {
      setinitData(res.data)
      setinitData((state) => {
        form.setFieldsValue({
          ...state
        })
      })
      setInitialSelect('selector', res.data.selector)
      setInitialSelect('hr', res.data.hr)
      setInitialSelect('admin', res.data.admin)
      setInitialSelect('external', res.data.externalUser)
    }, [])
  }, [])

  useEffect(() => {
    request('/' + get(urls[0], 'INTERVIEWER') + `/${id}`).then((res) => {
      setinitData(res.data)
      setinitData((state) => {
        form.setFieldsValue({
          ...state
        })
      })
      setInitialSelect('selector', res.data.selector)
      setInitialSelect('hr', res.data.hr)
      setInitialSelect('admin', res.data.admin)
      setInitialSelect('external', res.data.externalUser)
    }, [])
  }, [id])

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name='create_interviewer_form'
        onFinish={onFinish}
        initialValues={{
          interviewerId: record?.id,
          interviewerDesignation: record?.interviewerDesignation,
          interviewerName: record?.interviewerName,
          interviewerEmail: record?.interviewerEmail
        }}
        scrollToFirstError
        className={styles.create_admin_form}
      >
        <ArrowLeftOutlined
          style={{ fontSize: '20px', color: '#08c', cursor: 'pointer' }}
          onClick={() => {
            setIsEdit(false)
          }}
        />

        <Form.Item name='interviewerName' label='User Name' tooltip='Name as per certificate' rules={[]}>
          <Input />
        </Form.Item>

        <Form.Item name='interviewerEmail' label='User E-mail' rules={[]}>
          <Input />
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
            Edit User
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default EditInterviewer
