// Packages
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Table, Input, Form, Select, Spin, Space, Button, Modal } from 'antd'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { RootContext } from '../../Context/RootContext'
import { request, requestPdf, requestPost } from '../../services/request'
import { get, isEmpty } from 'lodash'
import { EditOutlined, EyeOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'
import { getFromLocal } from '../../utils/storage/index'
import FileSaver from 'file-saver'
import Logo from '../Admin/xlsIcon.png'
import { ModalContent } from './ModalContent'

const { Option } = Select
function handleChange() {}
let isExternalUser = getFromLocal('external') == 'true' ? true : false

const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode =
    inputType === 'select' ? (
      <Select style={{ width: 120 }} onChange={handleChange}>
        <Option value='Selected'>Selected</Option>
        <Option value='Rejected'>Rejected</Option>
        <Option value='Pending'>Pending</Option>
      </Select>
    ) : (
      <Input />
    )
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title} !`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const CandidateLists = () => {
  const history = useHistory()
  let match = useRouteMatch('/admin/candidateList/:page')
  const page = get(match, 'params.page', 1)
  const { getAllCandidate, isExternal } = useContext(RootContext)
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [candidates, setCandidates] = useState(getAllCandidate)
  const [candidatesCount, setCandidatesCount] = useState(0)
  const [filterApplied, setFilterApplied] = useState(false)
  const [isload, setisload] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)
  const [excelReportModal, setExcelReportModal] = useState(false)
  const [excelDatesRange, setExcelDatesRange] = useState([])

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const isEditing = (record) => record.key === editingKey

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size='small'
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({
                closeDropdown: false
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  useEffect(async () => {
    setisload(true)
    let candidatelist
    if (typeof parseInt(page) == 'number') {
      if (filterApplied) {
        candidatelist = await request('/candidate')
        setCandidates(candidatelist.data)
        setCandidatesCount(candidatelist.data.length)
      } else {
        candidatelist = await requestPost(`/candidate`, {
          records: 10,
          page: page
        })
        setCandidates(candidatelist.data['content'])
        setCandidatesCount(candidatelist.data['totalElements'])
      }

      // setCandidatesPage(candidatelist.data['totalPages'])
      window.scrollTo(0, 0)
      setisload(false)
    }
  }, [page, filterApplied])

  const cancel = (pagination, filters) => {
    setEditingKey('')
    if (isEmpty(filters['email']) && isEmpty(filters['fullName']) && isEmpty(filters['status']) && isEmpty(filters['candidateFeedback'])) {
      setFilterApplied(false)
      history.push(`/admin/candidateList/${pagination.current}`)
    } else if (!filterApplied) {
      history.push(`/admin/candidateList/${pagination.current}`)
      setFilterApplied(true)
    }
  }

  const columns =
    isExternal === 'true' || isExternalUser
      ? [
          {
            title: 'Name',
            dataIndex: 'firstName',
            width: '15%',
            editable: true,
            render: (text) => <span>{`${text}`}</span>,
            onFilter: (value, record) => `${record.firstName} ${record.lastName}`.toString().toLowerCase().includes(value.toLowerCase())
          },
          {
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
            editable: true,
            ...getColumnSearchProps('email')
          },
          {
            title: 'Job Title',
            dataIndex: 'jobTitle',
            width: '15%',
            editable: true
          },
          {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            editable: true,
            filterMode: 'menu',
            filters: [
              {
                text: 'Applied',
                value: 'Applied'
              },
              {
                text: 'Pending Shortlist',
                value: 'PendingShortList'
              },
              {
                text: 'Admin Reject',
                value: 'AdminReject'
              },
              {
                text: 'PendingShortList Dropped',
                value: 'PendingShortList-Dropped'
              },
              {
                text: 'PendingShortList OnHold',
                value: 'PendingShortList-OnHold'
              },
              {
                text: 'Short Listed',
                value: 'ShortListed'
              },
              {
                text: 'ShortListed OnHold',
                value: 'ShortListed-OnHold'
              },
              {
                text: 'ShortListed Dropped',
                value: 'ShortListed-Dropped'
              },
              {
                text: 'Rejected',
                value: 'NotShortListed'
              },
              {
                text: 'Schedule Round-1',
                value: 'ScheduleRound1'
              },
              {
                text: 'ScheduleRound1 OnHold',
                value: 'ScheduleRound1-OnHold'
              },
              {
                text: 'ScheduleRound1 Dropped',
                value: 'ScheduleRound1-Dropped'
              },
              {
                text: 'Reschedule Round-1',
                value: 'RescheduleRound1'
              },
              {
                text: 'RescheduleRound1-OnHold',
                value: 'RescheduleRound1 OnHold'
              },
              {
                text: 'RescheduleRound1-Dropped',
                value: 'RescheduleRound1 Dropped'
              },
              {
                text: 'Selected Round-1',
                value: 'SelectedRound1'
              },
              {
                text: 'SelectedRound1 Dropped',
                value: 'SelectedRound1-Dropped'
              },
              {
                text: 'SelectedRound1 OnHold',
                value: 'SelectedRound1-OnHold'
              },
              {
                text: 'Not Selected Round-1',
                value: 'NotSelectedRound1'
              },
              {
                text: 'Schedule Round-2',
                value: 'ScheduleRound2'
              },
              {
                text: 'ScheduleRound2 OnHold',
                value: 'ScheduleRound2-OnHold'
              },
              {
                text: 'ScheduleRound2 Dropped',
                value: 'ScheduleRound2-Dropped'
              },
              {
                text: 'Reschedule Round-2',
                value: 'RescheduleRound2'
              },
              {
                text: 'RescheduleRound2-OnHold',
                value: 'RescheduleRound2 OnHold'
              },
              {
                text: 'RescheduleRound2-Dropped',
                value: 'RescheduleRound2 Dropped'
              },
              {
                text: 'Selected Round-2',
                value: 'SelectedRound2'
              },
              {
                text: 'SelectedRound2 Dropped',
                value: 'SelectedRound2-Dropped'
              },
              {
                text: 'SelectedRound2 OnHold',
                value: 'SelectedRound2-OnHold'
              },
              {
                text: 'Not Selected Round-2',
                value: 'NotSelectedRound2'
              },
              {
                text: 'Schedule HR',
                value: 'ScheduledHr'
              },
              {
                text: 'ScheduledHr OnHold',
                value: 'ScheduledHr-OnHold'
              },
              {
                text: 'ScheduledHr-Dropped',
                value: 'ScheduledHr-Dropped'
              },
              {
                text: 'Reschedule HR',
                value: 'RescheduleHr'
              },
              {
                text: 'RescheduleHr OnHold',
                value: 'RescheduleHr-OnHold'
              },
              {
                text: 'RescheduleHr Dropped',
                value: 'RescheduleHr-Dropped'
              },
              {
                text: 'Offered',
                value: 'Offered'
              },
              {
                text: 'Offered OnHold',
                value: 'Offered-OnHold'
              },
              {
                text: 'Offered Dropped',
                value: 'Offered-Dropped'
              },
              {
                text: 'Accepted Offer',
                value: 'AcceptedOffer'
              },
              {
                text: 'Rejected Offer',
                value: 'RejectedOffer'
              },
              {
                text: 'Not Offered',
                value: 'NotOffered'
              },
              {
                text: 'Joined',
                value: 'Joined'
              },
              {
                text: 'Joined OnHold',
                value: 'Joined-OnHold'
              },
              {
                text: 'Joined Dropped',
                value: 'Joined-Dropped'
              },
              {
                text: 'NotJoined',
                value: 'NotJoined'
              },
              {
                text: 'Absconded',
                value: 'Absconded'
              }
            ].sort((a, b) => {
              if (a.value < b.value) {
                return -1
              }
              if (a.value > b.value) {
                return 1
              }
              return 0
            }),
            onFilter: (value, record) => record.candidateFeedback?.status === value,
            render: (value, record) => <span>{record.candidateFeedback?.status}</span>
          },
          {
            title: 'Edit',
            dataIndex: 'Action',
            render: (text, record) => (
              <>
                <Link style={{ marginRight: '10px' }} to={`/admin/edit_candidate/${record.id}`}>
                  <EditOutlined />
                </Link>
                {/* <Typography.Link   onClick={() => handleDelete(record)}>
                <DeleteOutlined />
            </Typography.Link> */}
              </>
            )
          }
        ]
      : [
          {
            title: 'Name',
            dataIndex: 'fullName',
            width: '10%',
            editable: true,
            ...getColumnSearchProps('fullName'),
            render: (text, record) =>
              searchedColumn === 'fullName' ? (
                <Link to={`/viewcandidate/${record.id}`}>
                  <span>
                    <Highlighter
                      highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0
                      }}
                      searchWords={[searchText]}
                      autoEscape
                      textToHighlight={
                        (`${record.firstName} ${record.lastName}` && `${record.firstName} ${record.lastName}`.toString()) || ''
                      }
                    />
                  </span>
                  <span style={{ float: 'right' }}>
                    <EyeOutlined />
                  </span>
                </Link>
              ) : (
                <Link to={`/viewcandidate/${record.id}`}>
                  <span>
                    {record.firstName} {record.lastName}
                  </span>
                  <span style={{ float: 'right' }}>
                    <EyeOutlined />
                  </span>
                </Link>
              ),
            onFilter: (value, record) => `${record.firstName} ${record.lastName}`.toString().toLowerCase().includes(value.toLowerCase())
          },
          {
            title: 'Email',
            dataIndex: 'email',
            width: '10%',
            editable: true,
            ...getColumnSearchProps('email')
          },
          {
            title: 'Job Title',
            dataIndex: 'jobTitle',
            width: '10%',
            editable: true
          },
          {
            title: 'Interviewer Name',
            dataIndex: 'candidateFeedback',
            width: '10%',
            editable: true,
            ...getColumnSearchProps('candidateFeedback'),
            render: (text) =>
              searchedColumn === 'candidateFeedback' ? (
                <Highlighter
                  highlightStyle={{
                    backgroundColor: '#ffc069',
                    padding: 0
                  }}
                  searchWords={[searchText]}
                  autoEscape
                  textToHighlight={`${text?.interviewerName}` ? `${text?.interviewerName}`.toString() : ''}
                />
              ) : (
                <span>{`${text?.interviewerName ? text.interviewerName : ''}`}</span>
              ),
            onFilter: (value, record) =>
              `${record?.candidateFeedback?.interviewerName ? record?.candidateFeedback.interviewerName : ''}`
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
          },
          {
            title: 'Interview Slot',
            dataIndex: 'interview_slot',
            width: '10%',
            editable: true,
            render: (value, record) =>
              (record.candidateFeedback?.nextInterviewDate &&
                record.candidateFeedback?.nextInterviewTime &&
                `${record.candidateFeedback?.nextInterviewDate}-${record.candidateFeedback?.nextInterviewTime}`) ||
              ''
          },
          // commented feedback column for admin pannel
          // {
          //   title: 'Feedback',
          //   dataIndex: 'Feedback',
          //   width: '20%',
          //   editable: false,
          //   render: (text,record) =>(
          //     <span>{record.candidateFeedback?.candidateHistory[0].feedBack} </span>)
          // },
          {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            editable: true,
            filterMode: 'menu',
            filters: [
              {
                text: 'Applied',
                value: 'Applied'
              },
              {
                text: 'Pending Shortlist',
                value: 'PendingShortList'
              },
              {
                text: 'Admin Reject',
                value: 'AdminReject'
              },
              {
                text: 'PendingShortList Dropped',
                value: 'PendingShortList-Dropped'
              },
              {
                text: 'PendingShortList OnHold',
                value: 'PendingShortList-OnHold'
              },
              {
                text: 'Short Listed',
                value: 'ShortListed'
              },
              {
                text: 'ShortListed OnHold',
                value: 'ShortListed-OnHold'
              },
              {
                text: 'ShortListed Dropped',
                value: 'ShortListed-Dropped'
              },
              {
                text: 'Rejected',
                value: 'NotShortListed'
              },
              {
                text: 'Schedule Round-1',
                value: 'ScheduleRound1'
              },
              {
                text: 'ScheduleRound1 OnHold',
                value: 'ScheduleRound1-OnHold'
              },
              {
                text: 'ScheduleRound1 Dropped',
                value: 'ScheduleRound1-Dropped'
              },
              {
                text: 'Reschedule Round-1',
                value: 'RescheduleRound1'
              },
              {
                text: 'RescheduleRound1-OnHold',
                value: 'RescheduleRound1 OnHold'
              },
              {
                text: 'RescheduleRound1-Dropped',
                value: 'RescheduleRound1 Dropped'
              },
              {
                text: 'Selected Round-1',
                value: 'SelectedRound1'
              },
              {
                text: 'SelectedRound1 Dropped',
                value: 'SelectedRound1-Dropped'
              },
              {
                text: 'SelectedRound1 OnHold',
                value: 'SelectedRound1-OnHold'
              },
              {
                text: 'Not Selected Round-1',
                value: 'NotSelectedRound1'
              },
              {
                text: 'Schedule Round-2',
                value: 'ScheduleRound2'
              },
              {
                text: 'ScheduleRound2 OnHold',
                value: 'ScheduleRound2-OnHold'
              },
              {
                text: 'ScheduleRound2 Dropped',
                value: 'ScheduleRound2-Dropped'
              },
              {
                text: 'Reschedule Round-2',
                value: 'RescheduleRound2'
              },
              {
                text: 'RescheduleRound2-OnHold',
                value: 'RescheduleRound2 OnHold'
              },
              {
                text: 'RescheduleRound2-Dropped',
                value: 'RescheduleRound2 Dropped'
              },
              {
                text: 'Selected Round-2',
                value: 'SelectedRound2'
              },
              {
                text: 'SelectedRound2 Dropped',
                value: 'SelectedRound2-Dropped'
              },
              {
                text: 'SelectedRound2 OnHold',
                value: 'SelectedRound2-OnHold'
              },
              {
                text: 'Not Selected Round-2',
                value: 'NotSelectedRound2'
              },
              {
                text: 'Schedule HR',
                value: 'ScheduledHr'
              },
              {
                text: 'ScheduledHr OnHold',
                value: 'ScheduledHr-OnHold'
              },
              {
                text: 'ScheduledHr-Dropped',
                value: 'ScheduledHr-Dropped'
              },
              {
                text: 'Reschedule HR',
                value: 'RescheduleHr'
              },
              {
                text: 'RescheduleHr OnHold',
                value: 'RescheduleHr-OnHold'
              },
              {
                text: 'RescheduleHr Dropped',
                value: 'RescheduleHr-Dropped'
              },
              {
                text: 'Offered',
                value: 'Offered'
              },
              {
                text: 'Offered OnHold',
                value: 'Offered-OnHold'
              },
              {
                text: 'Offered Dropped',
                value: 'Offered-Dropped'
              },
              {
                text: 'Accepted Offer',
                value: 'AcceptedOffer'
              },
              {
                text: 'Rejected Offer',
                value: 'RejectedOffer'
              },
              {
                text: 'Not Offered',
                value: 'NotOffered'
              },
              {
                text: 'Joined',
                value: 'Joined'
              },
              {
                text: 'Joined OnHold',
                value: 'Joined-OnHold'
              },
              {
                text: 'Joined Dropped',
                value: 'Joined-Dropped'
              },
              {
                text: 'NotJoined',
                value: 'NotJoined'
              },
              {
                text: 'Absconded',
                value: 'Absconded'
              }

              // {
              //   text: 'View All',
              //   value: '',
              // }
            ].sort((a, b) => {
              if (a.value < b.value) {
                return -1
              }
              if (a.value > b.value) {
                return 1
              }
              return 0
            }),
            onFilter: (value, record) => record.candidateFeedback?.status === value,
            render: (value, record) => <span>{record.candidateFeedback?.status}</span>
          },
          {
            title: 'Uploaded by',
            dataIndex: 'uploadedBy',
            width: '10%',
            editable: true,
            render: (text, record) => <span>{record['uploadedByName'] || ''}</span>
          },
          {
            title: 'Uploaded date',
            dataIndex: 'uploadedDate',
            width: '10%',
            editable: true,
            render: (text, record) => (
              <span>{(record['uploadedDate'] && record['uploadedDate'].slice(0, 10).replace(/-/g, '-')) || ''}</span>
            )
          },
          {
            title: 'Edit',
            dataIndex: 'Action',
            width: '10%',
            render: (text, record) => (
              <>
                <Link style={{ marginRight: '10px' }} to={`/admin/edit_candidate/${record.id}`}>
                  <EditOutlined />
                </Link>
              </>
            )
          }
        ]
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'status' ? 'select' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  const downloadReports = async (excelDates) => {
    let finalUrl = `/excelDownload`
    if (excelDates[0] && excelDates[1]) {
      finalUrl += `?startDate=${excelDates[0]}&endDate=${excelDates[1]}`
    }
    const res = await requestPdf(finalUrl)
    let view = new Uint8Array(res.data)
    let blob = new Blob([view], { type: 'application/octet-stream' })
    FileSaver.saveAs(blob, 'report' + `.xlsx`)
    setExcelReportModal(false)
    setExcelDatesRange([])
  }

  return (
    <>
      <Spin spinning={isload}>
        <Button style={{ float: 'right', margin: '10px', fontWeight: '500', border: '2px solid #1890ff' }}>
          Total Candidates: {candidatesCount}
        </Button>
        {isExternal !== 'true' && !isExternalUser && window.location.href.includes('admin') && (
          <img
            onClick={() => {
              setExcelReportModal(true)
            }}
            style={{ float: 'right', height: '91px', marginTop: '-10px', cursor: 'pointer' }}
            src={Logo}
          />
        )}
        <Form form={form} component={false}>
          <Table
            locale={{ emptyText: <span style={{ color: '#1890ff' }}>No Candidates Found</span> }}
            components={{
              body: {
                cell: EditableCell
              }
            }}
            bordered
            dataSource={candidates || []}
            columns={mergedColumns}
            rowClassName='editable-row'
            onChange={cancel}
            pagination={
              filterApplied
                ? null
                : {
                    total: candidatesCount,
                    current: parseInt(page) || 1,
                    pageSize: 10,
                    showSizeChanger: false
                  }
            }
          />
        </Form>
        {excelReportModal ? (
          <Modal
            visible={true}
            onCancel={() => {
              setExcelReportModal(false)
              setExcelDatesRange([])
            }}
            footer={[
              <div key={'footer'}>
                <Button
                  disabled={!(excelDatesRange[0] && excelDatesRange[1])}
                  key='back'
                  onClick={() => {
                    downloadReports(excelDatesRange)
                  }}
                >
                  submit
                </Button>
                <Button
                  key='back'
                  onClick={() => {
                    setExcelReportModal(false)
                    setExcelDatesRange([])
                  }}
                >
                  cancel
                </Button>
              </div>
            ]}
          >
            <ModalContent
              modalText={'Range of Days'}
              enableRangeDate={true}
              rangeDateText={'Select the Range'}
              rangeDateHandler={setExcelDatesRange}
            />
          </Modal>
        ) : null}
      </Spin>
    </>
  )
}

export default CandidateLists
