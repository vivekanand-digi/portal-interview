import React, { useEffect } from 'react'
import { Form, Select, Row, Col } from 'antd'

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

export const InterviewerModal = (props) => {
  useEffect(() => {
    props.getinterviewlist()
  }, [])
  const [form] = Form.useForm()
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
  return (
    <Row>
      <Col span={24}>
        <h2>Select Interviewer</h2>
        <Form {...formItemLayout} form={form} name='short_list_interviewer_form' style={{ width: '80%' }}>
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
        </Form>
      </Col>
    </Row>
  )
}
