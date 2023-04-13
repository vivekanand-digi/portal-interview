import React from 'react'
import { Form, Row, Col, DatePicker } from 'antd'
import moment from 'moment'

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

export const DateModal = (props) => {
  const [form] = Form.useForm()
  return (
    <Row>
      <Col span={24}>
        <h2>Date of Joining</h2>
        <Form {...formItemLayout} form={form} name='add_feedback_form' style={{ width: '80%' }}>
          <Form.Item
            name='Date of Joining'
            label='Select the Date'
            rules={[
              {
                required: true,
                message: 'Please Enter Date of Joining'
              }
            ]}
          >
            <DatePicker
              onChange={(date) => {
                props.setJoiningDate(date._d)
              }}
              style={{ width: '100%' }}
              disabledDate={(current) => {
                return moment().add(-1, 'days') >= current
              }}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
