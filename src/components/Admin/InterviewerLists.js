// Packages
import React, { useState, useEffect, useRef } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Spin, message, Space, Button } from 'antd'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

// Requests
import { requestDelete } from '../../services/request'

import { isEmpty } from 'lodash'
import Highlighter from 'react-highlight-words'

const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
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

const InterviewerLists = ({ setIsEdit, getAllInterviewerRecord, setDataBaseId }) => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [isload, setisload] = useState(false)
  const [interviewerAllData, setInterviewerAllData] = useState(getAllInterviewerRecord)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }

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

  useEffect(() => {
    setInterviewerAllData(getAllInterviewerRecord)
  }, [])

  useEffect(() => {
    setInterviewerAllData(getAllInterviewerRecord)
  }, [getAllInterviewerRecord])

  const isEditing = (record) => record.key === editingKey

  const edit = (key) => {
    setIsEdit(true)
    setDataBaseId(key.id)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)

      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, { ...item, ...row })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const handleDelete = async (key) => {
    try {
      const result = confirm('Want to delete?')
      if (result) {
        setisload(true)
        const finalUrl = `/deleteInterviewer/${key.id}`
        const res = await requestDelete(finalUrl, 'delete')
        await form.validateFields()
        const newData = [...interviewerAllData]
        const index = newData.findIndex((item) => key.id === item.id)
        newData.splice(index, 1)
        setInterviewerAllData(newData)
        setisload(false)
        if (res.status == 200) {
          message.success('Interviewer deleted successfully.')
        } else {
          let errorMsg = (res.data && res.data.message) || 'Failed to delete interviewer'
          message.error(errorMsg)
        }
      }
    } catch (errInfo) {
      setisload(false)
      message.error('Failed to delete Interviewer')
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'interviewerName',
      width: '15%',
      editable: true,
      ...getColumnSearchProps('interviewerName')
    },
    {
      title: 'User Email',
      dataIndex: 'interviewerEmail',
      width: '25%',
      editable: true,
      ...getColumnSearchProps('interviewerEmail')
    },
    {
      title: 'HR',
      dataIndex: 'hr',
      width: '10%',
      editable: true,
      render: (isHr) => {
        return <div>{`${isHr}`}</div>
      }
    },
    {
      title: 'Can Shortlist',
      dataIndex: 'selector',
      width: '10%',
      editable: true,
      render: (selector) => {
        return <div>{`${selector}`}</div>
      }
    },
    {
      title: 'Admin',
      dataIndex: 'admin',
      width: '10%',
      editable: true,
      render: (Admin) => {
        return <div>{`${Admin}`}</div>
      }
    },
    {
      title: 'External User',
      dataIndex: 'externalUser',
      width: '15%',
      editable: true,
      render: (externalUser) => {
        return <div>{`${externalUser}`}</div>
      }
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title='Sure to cancel?' onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{
                marginRight: 10
              }}
            >
              <EditOutlined />
            </Typography.Link>
            <Typography.Link disabled={editingKey !== ''} onClick={() => handleDelete(record)}>
              <DeleteOutlined />
            </Typography.Link>
          </>
        )
      }
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <>
      {!isEmpty(interviewerAllData) && (
        <Form form={form} component={false}>
          <Spin spinning={isload}>
            <Table
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              bordered
              dataSource={interviewerAllData}
              columns={mergedColumns}
              rowClassName='editable-row'
              pagination={{
                onChange: cancel
              }}
            />
          </Spin>
        </Form>
      )}
    </>
  )
}

export default InterviewerLists
