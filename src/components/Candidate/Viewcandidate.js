import { UserOutlined, DownloadOutlined, ContactsOutlined, EditOutlined, ArrowLeftOutlined, DatabaseOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Divider, Layout, message, Row, Spin, Typography } from 'antd'
import { Button } from '../../components/atoms/button/button'
import { get, isEmpty } from 'lodash'
import FileSaver from 'file-saver'
const { Title, Paragraph } = Typography
const { Content } = Layout
import React, { Component } from 'react'
import { request, requestPdf } from '../../services/request'
import { urls } from '../../services/URLs'
import './Candidate.css'
import { Link } from 'react-router-dom'
import Candidateworkflow from './CandidateFlow/Candidateworkflow'
import { RootContext } from '../../Context/RootContext'
import { getFromLocal } from '../../utils/storage/index'

class ViewCandidate extends Component {
  static contextType = RootContext
  constructor(props) {
    super(props)
    this.state = {
      candidate_id: '',
      candidate: {},
      isload: false,
      selectorData: {}
    }
  }

  componentDidMount() {
    const { candidate_id } = this.props.match.params
    this.setState({
      candidate_id
    })
    this.getcandidates(candidate_id)
  }

  getcandidates = async (id) => {
    try {
      this.setState({
        isload: true
      })
      const url = `/candidate/${id}`
      const res = await request(url)
      if (res) {
        this.setState({
          candidate: res.data
        })
        this.setState({
          isload: false
        })
      }
    } catch (e) {
      this.setState({
        isload: false
      })
      console.error('error', e)
      message.error('Error loading data' + e)
    }
  }

  refreshtheCandidateData = () => {
    const { candidate_id } = this.state
    this.getcandidates(candidate_id)
  }

  setLoader = (value) => {
    this.setState({ isload: value })
  }

  downloadResume = async (candidate) => {
    const { candidate_id } = this.state
    const finalUrl = `/${get(urls[0], 'GET_CANDIDATES')}/download/${candidate_id}`
    const res = await requestPdf(finalUrl)
    var view = new Uint8Array(res.data)
    let blob = new Blob([view], { type: 'application/octet-stream' })
    const docType = candidate.resume.split('.')
    FileSaver.saveAs(blob, candidate.firstName + `.${docType[1]}`)
  }

  render() {
    const { candidate, isload, candidate_id } = this.state
    let { role, emails, setEmails } = this.context
    return (
      <Layout>
        <Content style={{ margin: '30px' }}>
          <Spin spinning={isload}>
            <Row className='d-flex align-items-center justify-content-center justify-content-md-start'>
              <p
                onClick={() => {
                  window.history.back()
                }}
                style={{
                  margin: '20px',
                  textDecoration: 'underline',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#1890ff'
                }}
              >
                {' '}
                <span>
                  <ArrowLeftOutlined /> Back
                </span>
              </p>
              <Col span={16} className='align-left d-block d-md-none'>
                <Button
                  type='primary'
                  shape='round'
                  style={
                    candidate.resume == null
                      ? {
                          color: 'rgba(0, 0, 0, 0.25)',
                          borderColor: '#d9d9d9',
                          background: '#f5f5f5',
                          textShadow: 'none',
                          boxShadow: 'none'
                        }
                      : null
                  }
                  onClick={() => {
                    candidate.resume == null ? message.error('Resume does not exist') : this.downloadResume(candidate)
                  }}
                  icon={<DownloadOutlined />}
                >
                  Download Resume
                </Button>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col className='ant-col-24 ant-col-md-8 viewProfileCards'>
                <Row gutter={[24, 24]} className='justify-content-center justify-content-md-start'>
                  <Col className='avatar-align' style={{ display: 'flex', flexDirection: 'column' }}>
                    <Avatar size={80} icon={<UserOutlined />} />
                    <Title level={4} strong>
                      {candidate.firstName + ' ' + candidate.lastName}
                      <span style={{ padding: '0 20px' }}>
                        {getFromLocal('user_loged_in') === 'admin' && (
                          <Link to={`/admin/edit_candidate/${candidate_id}`}>
                            <EditOutlined />
                          </Link>
                        )}
                      </span>{' '}
                    </Title>
                  </Col>
                </Row>
                <Row type='flex' gutter={[24, 24]} className='topspacing'>
                  <Col span={24} style={{ height: '100%' }}>
                    <Title level={5}>
                      {' '}
                      <ContactsOutlined /> <span style={{ padding: '10px' }}>Personal Info</span>
                    </Title>
                    <Card>
                      {' '}
                      <Paragraph>
                        Email : <span> {candidate.email}</span>
                      </Paragraph>
                      <Divider />
                      <Paragraph>
                        Phone : <span> {candidate.phoneNumber}</span>
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col span={24} style={{ height: '100%' }}>
                    <Title level={5}>
                      {' '}
                      <DatabaseOutlined /> <span style={{ padding: '10px' }}>Professional Background</span>
                    </Title>
                    <Card>
                      <Paragraph>
                        Total Experience : <span>{candidate.experience} Years</span>
                      </Paragraph>
                      <Divider />
                      <Paragraph>
                        Relevant Experience : <span>{candidate.relavantExperience} Years</span>
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              </Col>

              <Col className='ant-col-24 ant-col-md-8' push={1}>
                <Row className='mt-xs-0 topMargin'>
                  {!isEmpty(candidate) && (
                    <Candidateworkflow
                      refreshtheCandidateData={() => {
                        this.refreshtheCandidateData()
                      }}
                      candidate={candidate}
                      selector={this.state.selectorData}
                      role={role}
                      setLoader={this.setLoader}
                      emails={emails}
                      setEmails={setEmails}
                    />
                  )}
                </Row>
              </Col>
              <Col className='ant-col-24 ant-col-md-8'>
                <Row className='topMargin' gutter={[24, 24]}>
                  <Col span={24} className='align-left d-none d-md-block'>
                    <Button
                      type='primary'
                      shape='round'
                      style={
                        candidate.resume == null
                          ? {
                              color: 'rgba(0, 0, 0, 0.25)',
                              borderColor: '#d9d9d9',
                              background: '#f5f5f5',
                              textShadow: 'none',
                              boxShadow: 'none'
                            }
                          : null
                      }
                      onClick={() => {
                        candidate.resume == null ? message.error('Resume does not exist') : this.downloadResume(candidate)
                      }}
                      icon={<DownloadOutlined />}
                    >
                      Download Resume
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Title level={5}>
                      {' '}
                      <ContactsOutlined /> <span style={{ padding: '10px' }}>Additional Information</span>
                    </Title>
                    <Card>
                      <Paragraph>Additional Comments: {candidate.jobDescription}</Paragraph>
                      <Divider />
                      <Paragraph>Skill Set: {candidate.skills}</Paragraph>
                      <Divider />
                      <Paragraph>Job Title: {candidate.jobTitle}</Paragraph>
                      <Divider />
                      <Paragraph>Notice Period: {candidate.noticePeriod}</Paragraph>
                      {getFromLocal('user_loged_in') === 'admin' || getFromLocal('isHr') === 'true' ? (
                        <>
                          <Divider />
                          <Paragraph>CTC: {candidate.currentCtc}</Paragraph>
                          <Divider />
                          <Paragraph>ECTC: {candidate.expectedCtc}</Paragraph>
                        </>
                      ) : null}
                      {candidate.currentOrganisation?<><Divider />
                      <Paragraph>Current Organisation: {candidate.currentOrganisation}</Paragraph></>:null}
                      <Divider/>
                      <Paragraph>Point of Contact : {candidate.pointOfContact && candidate.pointOfContact.map((candidateItm,index)=>{
                        return <span key={index}>{candidateItm.interviewerName}{candidate.pointOfContact.length-1 == index?null:<>&#44;</>}</span>
                      })}</Paragraph>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Spin>
        </Content>
      </Layout>
    )
  }
}

export default ViewCandidate
