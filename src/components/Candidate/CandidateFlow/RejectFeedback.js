import React from 'react'
import { Form, Input, Row, Col } from 'antd'

const { TextArea } = Input

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

export const RejectFeedback = (props) => {
  const [form] = Form.useForm()
  return (
    <Row>
      <Col span={24}>
        <h2>Reject Feedback</h2>
        <Form {...formItemLayout} form={form} name='add_feedback_form' style={{ width: '80%' }}>
          <Form.Item
            name='feedback'
            label='Feedback'
            rules={[
              {
                required: true,
                message: 'Please Enter Feedback !'
              }
            ]}
          >
            <TextArea
              rows={4}
              onChange={(e) => {
                props.OnchangeFeedbackComments(e)
              }}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
