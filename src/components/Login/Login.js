// Packages
import React, { useState, useEffect, useContext } from 'react'

import { Form, Input, message, Row, Col } from 'antd'
import { Button } from '../../components/atoms/button/button'

import { AzureAD } from 'react-aad-msal'
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { authProvider } from '../AdLogin/authProvider'

import { withRouter } from 'react-router-dom'

// Styles
import styles from '../../styles/login.module.css'

// Context
import { RootContext } from '../../Context/RootContext'

// Utils
import { getFromLocal, removeFromLocal, setToLocal, setCookie } from '../../utils/storage/index'
import { requestPost } from '../../services/request'
import { microsoftLoginPath } from '../../Constants/constants'

const Login = (props) => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState({}) // To disable submit button at the beginning.
  const {
    setIsLogedIn = () => {},
    setuserName = () => {},
    setIsExternal = () => {},
    setInterviewerDataWhenLogin,
    SetRole
  } = useContext(RootContext)
  const [externalUser, setExternalUser] = useState(false)

  useEffect(() => {
    const loginToken = getFromLocal('msal.ba6f6865-88a9-43b7-ac2b-b002b3168225.idtoken') //client id
    forceUpdate({})
    if (loginToken) {
      loginWithToken(loginToken)
    } else {
      removeFromLocal('userName')
      setIsLogedIn(false)
      setCookie('token', '', 0)
      removeFromLocal('user_logged_in')
    }
  }, [])

  const onFinish = async ({ userName, password }) => {
    const payload = { userName, password }
    const res = await requestPost('login', payload)
    if (res.data && res['status'] == 200) {
      let token = (res.data && res.data.token) || ''
      setCookie('token', token, 360)
      setIsLogedIn(true)
      setToLocal('external', true)
      setToLocal('user_loged_in', 'admin')
      setuserName(res.data.userName), setIsExternal('true')
      setToLocal('userName', res.data.userName)
      props.history.push('/admin')
    } else {
      message.error((res.data && res.data['message']) || 'please provide valid credentials')
    }
  }

  const onFinishFailed = (errorInfo) => {
    message.error('This is an error message')
    console.log('Failed:', errorInfo)
  }

  const loginWithToken = async (loginToken) => {
    const payload = loginToken
    let options = {
      method: 'POST',
      body: payload
    }
    let res = await requestPost('loginWithToken', options)
    if (res.data && res.data.id) {
      let token = (res.data && res.data.token) || ''
      setCookie('token', token, 360)
      if (res.data.admin === true) {
        SetRole('Admin')
        setToLocal('user_loged_in', 'admin')
        props.history.push('/admin')
      } else {
        SetRole('interviewer')
        setToLocal('user_loged_in', 'interviewer')
        props.history.push('/interviewerClient')
      }
      if (res.data.hr === true) {
        setToLocal('isHr', 'true')
      }
      if (res.data.selector === true) {
        setToLocal('selector', 'true')
      }
      message.success('logged in successfully.')
      setIsLogedIn(true)
      setuserName(res.data.userName)
      setInterviewerDataWhenLogin({ id: res.data.id })
      setToLocal('user_id', res.data.id)
      setToLocal('userName', res.data.userName)
    } else {
      message.error("you don't have access to use this portal.")
    }
  }

  return (
    <>
      {externalUser ? (
        <Form
          form={form}
          name='basic'
          labelCol={{
            span: 8
          }}
          wrapperCol={{
            span: 16
          }}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <ArrowLeftOutlined
            onClick={() => {
              setExternalUser(false)
            }}
            style={{ fontSize: '20px', color: '#08c', cursor: 'pointer' }}
          />
          <Form.Item
            name='userName'
            label='username'
            rules={[
              {
                required: true,
                message: 'Please input your username!'
              }
            ]}
          >
            <Input prefix={<UserOutlined className='site-form-item-icon' />} placeholder='Username' />
          </Form.Item>

          <Form.Item
            name='password'
            label='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password prefix={<LockOutlined className='site-form-item-icon' />} type='password' placeholder='Password' />
          </Form.Item>

          <Form.Item shouldUpdate>
            {() => (
              <Button
                type='primary'
                htmlType='submit'
                disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                className={styles.login_button}
              >
                Log in
              </Button>
            )}
          </Form.Item>
        </Form>
      ) : (
        <>
          <Row style={{ alignItems: 'center' }}>
            <Col style={{ alignItems: 'center' }}>
              <AzureAD provider={authProvider} forceLogin={false}>
                {({ login }) => {
                  return (
                    <div style={{ marginTop: '20px' }}>
                      <button className={styles.microsoft_login} onClick={login}>
                        <img className={styles.microsoft_logo} alt='svgImg' src={microsoftLoginPath} /> Sign in With Microsoft
                      </button>
                    </div>
                  )
                }}
              </AzureAD>
            </Col>
          </Row>
          <Row style={{ margin: '20px' }}>
            <Col>
              <Button
                type='primary'
                onClick={() => {
                  setExternalUser(true)
                }}
              >
                Sign in as External
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default withRouter(Login)
