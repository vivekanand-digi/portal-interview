import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Row, Col } from 'antd'
import { Button } from '../../components/atoms/button/button'
const { TextArea } = Input

// Styles
import styles from '../../styles/create_admin.module.css'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

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

function CandidateFeedbackForm({ id, from }) {
  const [form] = Form.useForm()

  const [isFromInterviewer, _] = useState(!!from)
  const onFinish = () => {}
  function handleChange() {}

  useEffect(() => {
    form.setFieldsValue({
      candidateId: id,
      interviwerId: '624fb84aa4c00b2a0031a461'
      // hardcoded as of now
    })
  }, [])

  return (
    <Row>
      <Col span={isFromInterviewer ? 24 : 15} offset={isFromInterviewer ? 4 : 2}>
        <div>
          <Link to={isFromInterviewer ? '/interviewerClient' : '/admin'}>
            <ArrowLeftOutlined style={{ fontSize: '20px', color: '#08c', cursor: 'pointer' }} />
            Feedback for Candidate - {id}
          </Link>
        </div>
        <Form
          {...formItemLayout}
          form={form}
          name='create_candidate_form'
          onFinish={onFinish}
          initialValues={{
            prefix: '91',
            status: 'Round2',
            technicalSkills: '1',
            communicationSkills: '1',
            analyticalSkills: '1',
            realTimeDebuggingSkills: '1',
            confidenceLevels: '1',
            previousProjects: '1'
          }}
          scrollToFirstError
          className={styles.create_admin_form}
          style={!isFromInterviewer ? { width: '80%' } : {}}
        >
          <Form.Item name='candidateId' label='Candidate Id' hidden>
            <Input disabled hidden />
          </Form.Item>

          <Form.Item name='interviwerId' label='Interviewer Name' hidden>
            <Input hidden />
          </Form.Item>

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
            <TextArea rows={4} />
          </Form.Item>

          {/* <Form.Item
                        name="firstName"
                        label="First Name"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[]}
                    >
                        <Input disabled />
                    </Form.Item> */}

          {/* <Form.Item
                        name="phoneNumber"
                        label="Candidate Mobile no"
                        rules={[]}
                    >
                        <Input
                            addonBefore={prefixSelector}
                            style={{
                                width: '100%',
                            }}
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Candidate E-mail"
                        rules={[]}
                    >
                        <Input disabled />
                    </Form.Item> */}

          {/* <Form.Item
                        name="Skill Sets"
                        label="Skill Sets"
                        tooltip="Write skills with comma"
                        rules={[]}
                    >
                        <Input disabled />
                    </Form.Item> */}

          {/* <Form.Item
                        name=""
                        label="Job Title"
                        rules={[]}
                    >
                        <Input disabled />
                    </Form.Item> */}

          <Form.Item name='roundStatus' label='Round Status' rules={[{ required: true, message: 'Please Enter Feedback !' }]}>
            <Select onChange={handleChange}>
              <Option value='selected'>Selected</Option>
              <Option value='rejected'>Rejected</Option>
              {/* <Option value="Round3">Round3</Option> */}
            </Select>
          </Form.Item>

          {/* {
                        isFromInterviewer && (
                            <>
                                <Form.Item
                                    name="technicalSkills"
                                    label="Technical Skills"
                                    tooltip="On Scale of 1-10"
                                    rules={[]}
                                >
                                    <Slider max={10} />
                                </Form.Item>
                                <Form.Item
                                    name="communicationSkills"
                                    label="Communication Skills"
                                    tooltip="On Scale of 1-10"
                                    rules={[]}
                                >
                                    <Slider max={10} />
                                </Form.Item>
                                <Form.Item
                                    name="analyticalSkills"
                                    label="Analytical Skills"
                                    tooltip="On Scale of 1-10"
                                    rules={[]}
                                >
                                    <Slider max={10} />
                                </Form.Item>
                                <Form.Item
                                    name="realTimeDebuggingSkills"
                                    label="Real time Debugging Skills"
                                    tooltip="On Scale of 1-10"
                                    rules={[]}
                                >
                                    <Slider max={10} />
                                </Form.Item>
                                <Form.Item
                                    name="confidenceLevels"
                                    label="Confidence levels"
                                    tooltip="On Scale of 1-10"
                                    rules={[]}
                                >
                                    <Slider max={10} />
                                </Form.Item>
                                <Form.Item
                                    name="previousProjects"
                                    label="Previous Projects"
                                    tooltip="On Scale of 1-10"
                                    rules={[]}
                                >
                                    <Slider max={10} />
                                </Form.Item>

                                <Form.Item
                                    name="feedback"
                                    label="Feedback"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Feedback !'
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </>
                        )
                    } */}
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CandidateFeedbackForm
