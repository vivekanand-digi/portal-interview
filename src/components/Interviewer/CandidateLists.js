// Packages
import React, { useState, useEffect, useContext } from 'react'
import { Table, Input, Form, Select } from 'antd'
import { Link } from 'react-router-dom'
import { request } from '../../../src/services/request'
import { urls } from '../../../src/services/URLs'
import { get } from 'lodash'
import { RootContext } from '../../Context/RootContext'
import { EyeOutlined } from '@ant-design/icons'
import { getFromLocal } from '../../utils/storage/index'

const { Option } = Select

function handleChange() {}

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
              message: `Please Input ${title}!`
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
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [candidates, setCandidates] = useState([])
  const { interviewerDataWhenLogin } = useContext(RootContext)
  const [sessionId, setSessionId] = useState({})

  const isEditing = (record) => record.key === editingKey

  useEffect(async () => {
    const interviewerId = await (interviewerDataWhenLogin.id || getFromLocal('user_id'))
    if (interviewerId) {
      const finalUrl = `/${get(urls[0], 'GET_CANDIDATES')}/${get(urls[0], 'INTERVIEWER')}/${interviewerId}`
      const res = await request(finalUrl)
      setCandidates(res.data)
    }
  }, [interviewerDataWhenLogin.id])

  useEffect(() => {
    if (interviewerDataWhenLogin.id || getFromLocal('user_id')) {
      setSessionId(interviewerDataWhenLogin.id || getFromLocal('user_id'))
    }
  })

  const cancel = () => {
    setEditingKey('')
  }

  const columns = [
    {
      title: 'Candidate Name',
      dataIndex: 'candidate_name',
      width: '15%',
      editable: true,
      render: (text, record) => (
        <Link to={`/viewcandidate/${record.id}`}>
          <span>
            {record.firstName} {record.lastName}
          </span>
          <span style={{ float: 'right' }}>
            <EyeOutlined />
          </span>
        </Link>
      )
    },
    {
      title: 'Candidate Email',
      dataIndex: 'email',
      width: '15%',
      editable: true
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      width: '10%',
      editable: true
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
    {
      title: 'Status',
      dataIndex: 'status',
      width: '20%',
      editable: true,
      filterMode: 'menu',
      filters: [
        {
          text: 'Applied',
          value: 'Applied'
        },
        {
          text: 'Short Listed',
          value: 'ShortListed'
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
          text: 'Reschedule Round-1',
          value: 'ReScheduleRound1'
        },
        {
          text: 'Selected Round-1',
          value: 'SelectedRound1'
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
          text: 'Reschedule Round-2',
          value: 'ReScheduleRound2'
        },
        {
          text: 'Selected Round-2',
          value: 'SelectedRound2'
        },
        {
          text: 'Not Selected Round-2',
          value: 'NotSelectedRound2'
        },
        {
          text: 'Schedule HR',
          value: 'ScheduleHr'
        },
        {
          text: 'Reschedule HR',
          value: 'ReScheduleHr'
        },
        {
          text: 'Offered',
          value: 'Offered'
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
        }
      ],
      onFilter: (value, record) => record.candidateFeedback?.status.includes(value),
      render: (value, record) => <span>{record.candidateFeedback?.status}</span>
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

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={candidates || []}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel
        }}
      />
    </Form>
  )
}

export default CandidateLists
