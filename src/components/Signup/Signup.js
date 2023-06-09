import React from 'react'
import { Form, Input, Button } from 'antd'

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

const Signup = ({ setNewUser }) => {
  const [form] = Form.useForm()

  const onFinish = () => {
    setNewUser(false)
  }
  return (
    <Form {...formItemLayout} form={form} name='register' onFinish={onFinish} initialValues={{}} scrollToFirstError>
      <Form.Item
        name='FirstName'
        label='First Name'
        rules={[
          {
            required: true,
            message: 'Please fill this field'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='LastName'
        label='Last Name'
        rules={[
          {
            required: true,
            message: 'Please fill this field'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='email'
        label='E-mail'
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
        <Input />
      </Form.Item>

      <Form.Item
        name='password'
        label='Password'
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          }
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name='confirm'
        label='Confirm Password'
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }

              return Promise.reject(new Error('The two passwords that you entered do not match!'))
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item shouldUpdate {...tailFormItemLayout}>
        {() => (
          <Button
            type='primary'
            htmlType='submit'
            disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
          >
            Register
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

export default Signup
