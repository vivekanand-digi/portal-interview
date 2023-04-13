import React from 'react'
import { Form, Row, Col, DatePicker } from 'antd'
const { RangePicker } = DatePicker

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

export const ModalContent = (props) => {
  const { enableRangeDate, rangeDateText, rangeDateHandler, modalText } = props
  const [form] = Form.useForm()
  return (
    <Row>
      <Col span={24}>
        <h3>{modalText || ''}</h3>
        <Form {...formItemLayout} form={form} name='add_feedback_form' style={{ width: '80%' }}>
          <Form.Item
            name='Date of Joining'
            label={rangeDateText || 'Select the Date'}
            rules={[
              {
                required: true,
                message: 'Please Enter Date of Joining'
              }
            ]}
          >
            {enableRangeDate ? (
              <RangePicker
                onChange={(dateMoment, dateRange) => {
                  rangeDateHandler(dateRange)
                }}
              />
            ) : null}
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}
