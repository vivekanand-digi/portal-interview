// Packages
import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, InputNumber, Row, Col, message, Layout, Spin, AutoComplete } from 'antd'
const { TextArea } = Input

const { Content } = Layout

// Styles
import styles from '../../styles/create_admin.module.css'
import { isEmpty } from 'lodash'
import { request, requestPost } from '../../services/request'
import { getFromLocal } from '../../utils/storage/index'

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

const prefixSelector = (
  <Form.Item name='prefix' noStyle>
    <Select
      style={{
        width: 70
      }}
    >
      <Option value='91'>+91</Option>
    </Select>
  </Form.Item>
)

function CandidateForm() {
  const [form] = Form.useForm()
  const [expInYear, setExpInYear] = useState(0)
  const [relExpInYear, setRelExpInYear] = useState(0)
  const [isload, setisload] = useState(false)
  const [disablePhone, setDisablePhone] = useState(false)
  const [disableEmail, setDisableEmail] = useState(false)
  const [selectorsData, setSelectorsData] = useState([])
  const [uploadResumeFile, setUploadResumeFile] = useState(null)
  const [adminsList, setAdminList] = useState([])

  useEffect(async () => {
    const finalUrl = `/interviewer/selectors`
    const res = await request(finalUrl)
    const adminurl = `/admins`
    const adminRes = await request(adminurl)
    setAdminList(adminRes.data)
    setSelectorsData(res.data)
  }, [])

  const renderOptions = (data) => {
    return (
      data &&
      data.map((value, index) => {
        return (
          <Option key={index} value={value.id}>
            {value.interviewerName + '-' + value.interviewerEmail}
          </Option>
        )
      })
    )
  }

  const validatePhoneAndEmail = async (e, type) => {
    if (!isEmpty(e.currentTarget.value || e.currentTarget.textContent)) {
      const res = await requestPost(`/validateCandidate/${e.currentTarget.value || e.currentTarget.textContent}`)
      if (res.data === '') {
        type === 'phone' ? setDisablePhone(false) : setDisableEmail(false)
      } else {
        message.error('candidate already registered')
        type === 'phone' ? setDisablePhone(true) : setDisableEmail(true)
      }
    }
  }

  const uploadResume = (e) => {
    let data = e.target.files[0]
    setUploadResumeFile(data)
  }

  const CreateCandidateHandler = async (values) => {
    setisload(true)
    try {
      const formData = new FormData()
      const ignoreFile = ['file', 'experience', 'relavantExperience', 'lastName']
      for (let key in values) {
        if (ignoreFile.includes(key)) {
          continue
        }
        formData.append(key, values[key]?.toString().trim())
      }
      formData.append('experience', expInYear)
      formData.append('lastName', values.lastName.trim())
      formData.append('relavantExperience', relExpInYear)
      formData.append('file', uploadResumeFile)
      let isExternalUser = getFromLocal('external') == 'true' ? true : false
      const res = await requestPost('/createCandidate', formData, 'post', { isExternalUser })

      if (res && res.status == 200) {
        message.success('Candidate create succesfully.')
        form.resetFields()
        setisload(false)
      } else {
        setisload(false)
        let errorMsg = (res.data && res.data.message) || 'Failed to create candidate'
        message.error(errorMsg)
      }
    } catch (e) {
      console.error(e)
      message.error('Found error please try again')
      setisload(false)
    }
  }

  const handleChange = () => {}

  return (
    <Layout>
      <Spin spinning={isload}>
        <Content>
          <Form
            {...formItemLayout}
            form={form}
            name='create_candidate_form'
            onFinish={CreateCandidateHandler}
            initialValues={{
              prefix: '91',
              uploadResume: 'fileList',
              currentOrganisation:"",
              expectedCtc:0,
              currentCtc:0
            }}
            scrollToFirstError
            className={styles.create_admin_form}
          >
            <Form.Item
              name='firstName'
              label='First Name'
              tooltip='Name as per certificate'
              rules={[
                {
                  required: true,
                  message: 'Please enter valid First Name!',
                  whitespace: true,
                  max: 50
                }
              ]}
            >
              <AutoComplete autoComplete='off' />
            </Form.Item>

            <Form.Item
              name='lastName'
              label='Last Name'
              tooltip='Name as per certificate'
              rules={[
                {
                  required: true,
                  message: 'Please enter valid Last Name!',
                  max: 50
                }
              ]}
            >
              <AutoComplete autoComplete='off' />
            </Form.Item>

            <Form.Item
              name='phoneNumber'
              label='Candidate Mobile no'
              rules={[
                {
                  required: true,
                  message: 'Please input valid Candidate mobile number!',
                  max: 10,
                  min: 10
                }
              ]}
            >
              <AutoComplete
                autoComplete='off'
                addonBefore={prefixSelector}
                style={{
                  width: '100%'
                }}
                type='number'
                onBlur={(e) => validatePhoneAndEmail(e, 'phone')}
              />
            </Form.Item>

            <Form.Item
              name='email'
              label='Candidate E-mail'
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
              <AutoComplete autoComplete='off' onBlur={(e) => validatePhoneAndEmail(e, 'email')} />
            </Form.Item>

            <Form.Item
              name='skills'
              label='Skill Sets'
              tooltip='Write skills with comma'
              rules={[
                {
                  required: true,
                  message: 'Please enter Skill Sets!',
                  whitespace: true
                }
              ]}
            >
              <AutoComplete autoComplete='off' />
            </Form.Item>

            <Form.Item
              name='jobTitle'
              label='Job Title'
              rules={[
                {
                  required: true,
                  message: 'Please enter Job Title!',
                  whitespace: true,
                  max: 50
                }
              ]}
            >
              <AutoComplete autoComplete='off' />
            </Form.Item>

            <Form.Item
              name='jobDescription'
              label='Additional Comments'
              rules={[
                {
                  required: true,
                  message: 'Please Enter description !'
                }
              ]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name='experience'
              label='Total Experience'
              rules={[
                {
                  required: false,
                  message: 'Please enter Total Experience!',
                  whitespace: true
                }
              ]}
            >
              <Input.Group size='large'>
                <Row gutter={16}>
                  <Col span={10}>
                    <InputNumber onChange={(value) => setExpInYear(value)} addonAfter='Years' min='0' step='0.1' />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name='relavantExperience'
              label='Relavant Experience'
              rules={[
                {
                  required: false,
                  message: 'Please input relavant Experience'
                }
              ]}
            >
              <Input.Group size='large'>
                <Row gutter={16}>
                  <Col span={10}>
                    <InputNumber onChange={(value) => setRelExpInYear(value)} addonAfter='Years' min='0' step='0.1' />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
            <Form.Item
              name='file'
              label='Upload Resume'
              rules={[
                {
                  required: true
                }
              ]}
            >
              <input type='file' id='myfile' name='myfile' onChange={(e) => uploadResume(e)}></input>
            </Form.Item>
            <Form.Item
              name='currentCtc'
              label='Current CTC'
              rules={[
                {
                  required: true,
                  message: 'Please Enter current CTC'
                }
              ]}
            >
              <Input type={'number'} defaultValue={0} />
            </Form.Item>
            <Form.Item
              name='expectedCtc'
              label='Expected CTC'
              rules={[
                {
                  required: true,
                  message: 'Please Enter expected CTC'
                }
              ]}
            >
              <Input type={'number'} defaultValue={0} />
            </Form.Item>
            <Form.Item
              name='currentOrganisation'
              label='Current Organisation Name'
              rules={[
                {
                  required: false,
                  message: 'Please enter Current Organisation Name',
                  whitespace: true,
                  max: 50
                }
              ]}
            >
             <AutoComplete autoComplete='off' />
            </Form.Item>
            <Form.Item
              name='noticePeriod'
              label='Notice Period'
              rules={[
                {
                  required: true,
                  message: 'Please Enter Notice Period'
                }
              ]}
            >
              <AutoComplete autoComplete='off' />
            </Form.Item>
            <Form.Item
              name='pointOfContactIds'
              label='Select Point of Contact'
              rules={[
                {
                  required: true,
                  message: 'Please Select atleast One'
                }
              ]}
            >
              <Select style={{ width: 200 }} mode='multiple' allowClear>
                {renderOptions(adminsList || [])}
              </Select>
            </Form.Item>
            {getFromLocal('external') !== 'true' && (
              <Form.Item
                name='selectorId'
                label='Select Interviewer'
                rules={[
                  {
                    required: true,
                    message: 'Please Select Interviewer'
                  }
                ]}
              >
                <Select style={{ width: 200 }} onChange={handleChange}>
                  {renderOptions(selectorsData || [])}
                </Select>
              </Form.Item>
            )}
            <Form.Item {...tailFormItemLayout}>
              <Button type='primary' htmlType='submit' disabled={disableEmail || disablePhone}>
                Save candidate
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Spin>
    </Layout>
  )
}

export default CandidateForm
