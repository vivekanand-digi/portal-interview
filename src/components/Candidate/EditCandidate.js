import React, { useState, useEffect, useContext } from 'react'
import { Form, Input, Select, InputNumber, Row, Col, Alert, Layout, Spin, message } from 'antd'

import { Button } from '../../components/atoms/button/button'

const { Content } = Layout
const { TextArea } = Input
import { RootContext } from '../../Context/RootContext'

// Styles
import styles from '../../styles/create_admin.module.css'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { request, createRequest } from '../../services/request'
import { get, isEmpty } from 'lodash'
import { urls } from '../../services/URLs'
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
      defaultValue={'91'}
    >
      <Option value='91'>+91</Option>
    </Select>
  </Form.Item>
)

const external = getFromLocal('external')
function EditCandidate({ id, from }) {
  const { isExternal } = useContext(RootContext)
  const [form] = Form.useForm()
  const [expInYear, setExpInYear] = useState(0)
  const [relExpInYear, setRelExpInYear] = useState(0)
  const [uploadResumeFile, setUploadResumeFile] = useState(null)
  const [selectorsData, setSelectorsData] = useState([])
  const [initData, setinitData] = useState([])
  const [isupdated, setisupdated] = useState({})
  const [isload, setisload] = useState(false)
  const [adminsList, setAdminList] = useState([])

  const [isFromInterviewer, _] = useState(!!from)

  const uploadResume = (e) => {
    let data = e.target.files[0]
    setUploadResumeFile(data)
  }

  const onFinish = (values) => {
    const formData = new FormData()
    const ignoreFile = ['file', 'experience', 'relavantExperience', 'lastName', 'id']
    for (let key in values) {
      if (ignoreFile.includes(key)) {
        continue
      }
      formData.append(key, (values[key] && values[key].toString()) || '')
    }
    formData.append('experience', expInYear)
    formData.append('lastName', values.lastName)
    formData.append('relavantExperience', relExpInYear)
    formData.append('file', uploadResumeFile)
    formData.append('id', `${id}`)
    const finalUrl = '/updateCandidate'
    message.loading('Action in progress..')
    createRequest(finalUrl, 'put', formData)
      .then((res) => {
        if (res.status == 200) {
          message.success('Candidate Updated succesfully')
        } else {
          let errorMsg = (res.data && res.data.message) || 'Failed to update interviewer'
          message.error(errorMsg)
        }
        setisload(false)
      })
      .catch(() => {
        message.error('Candidate Update failed')
        setisload(false)
      })
  }

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

  function handleChange() {}
  const handleClose = () => {
    setisupdated({})
  }

  useEffect(() => {
    setisload(true)
    request('/' + get(urls[0], 'GET_CANDIDATES') + `/${id}`).then((res) => {
      setinitData(res.data)
      setinitData((state) => {
        form.setFieldsValue({
          ...state
        })
        let pointOfContact =
          state &&
          state.pointOfContact &&
          state.pointOfContact.map((interviewer) => {
            return interviewer.id
          })
        form.setFieldsValue({ pointOfContactIds: pointOfContact })
        setRelExpInYear(state['relavantExperience'])
        setExpInYear(state['experience'])
        setisload(false)
      })
    }, [])
  }, [])

  useEffect(async () => {
    if (!(isExternal == 'true' || external == 'true')) {
      const finalUrl = `/interviewer/selectors`
      const res = await request(finalUrl)
      setSelectorsData(res.data)
    }
    const adminurl = `/admins`
    const adminRes = await request(adminurl)
    setAdminList(adminRes.data)
  }, [])

  return (
    <Layout>
      <Spin spinning={isload}>
        <Content>
          <Row>
            <Col span={isFromInterviewer ? 24 : 15} offset={isFromInterviewer ? 3 : 3}>
              {!isEmpty(isupdated) && <Alert message={isupdated.message} type={isupdated.type} closable afterClose={handleClose} />}
            </Col>
          </Row>

          <Row>
            <Col span={isFromInterviewer ? 24 : 15} offset={isFromInterviewer ? 4 : 2} className='width-12-mobile'>
              <div>
                <Link to={isFromInterviewer ? '/interviewerClient' : '/admin'}>
                  <ArrowLeftOutlined style={{ fontSize: '20px', color: '#08c', cursor: 'pointer', margin: '30px 0' }} />
                  Back
                </Link>
              </div>
              <Form
                {...formItemLayout}
                form={form}
                name='create_candidate_form'
                onFinish={onFinish}
                scrollToFirstError
                className={styles.create_admin_form}
              >
                <Form.Item
                  name='firstName'
                  label='First Name'
                  rules={[
                    {
                      message: 'Please enter valid First Name!',
                      whitespace: true,
                      max: 50
                    }
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name='lastName'
                  label='Last Name'
                  rules={[
                    {
                      message: 'Please enter valid Last Name!',
                      max: 50
                    }
                  ]}
                >
                  <Input />
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
                  <Input
                    addonBefore={prefixSelector}
                    style={{
                      width: '100%'
                    }}
                    type='number'
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
                  <Input />
                </Form.Item>

                <Form.Item
                  name='skills'
                  label='Skill Sets'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter Skill Sets!'
                    }
                  ]}
                >
                  <Input />
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
                  <Input />
                </Form.Item>

                <Form.Item
                  name='jobDescription'
                  label='Additional comments'
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter description !'
                    }
                  ]}
                >
                  <TextArea rows={3} />
                </Form.Item>

                <Form.Item name='experience' label='Total Experience' rules={[]}>
                  <Input.Group size='large'>
                    <Row gutter={16}>
                      <Col span={10}>
                        <InputNumber onChange={(value) => setExpInYear(value)} addonAfter='Years' value={expInYear} min='0' step='0.1' />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>

                <Form.Item name='relavantExperience' label='Relavant Experience' rules={[]}>
                  <Input.Group size='large'>
                    <Row gutter={16}>
                      <Col span={10}>
                        <InputNumber
                          onChange={(value) => setRelExpInYear(value)}
                          addonAfter='Years'
                          value={relExpInYear}
                          min='0'
                          step='0.1'
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>

                <Form.Item
                  name='file'
                  label='Upload Resume'
                  rules={[
                    {
                      required: false
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
                      required: true,
                      message: 'Please enter Current Organisation Name',
                      whitespace: true,
                      max: 50
                    }
                  ]}
                >
                  <Input />
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
                  <Input />
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
                {isExternal == 'true' || external == 'true' ? null : (
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
                      {renderOptions(selectorsData)}
                    </Select>
                  </Form.Item>
                )}
                <Form.Item {...tailFormItemLayout}>
                  <Button type='primary' htmlType='submit'>
                    Edit candidate
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Content>
      </Spin>
    </Layout>
  )
}

export default EditCandidate
