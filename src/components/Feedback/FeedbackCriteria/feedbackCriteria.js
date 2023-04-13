import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Form, Input, Typography, Table, Select } from 'antd'
import { Button } from '../../../components/atoms/button/button'
import { get, isEmpty } from 'lodash'

import React, { useState, useEffect } from 'react'
import { request, requestDelete, requestPost } from '../../../services/request'
import { urls } from '../../../services/URLs'
import styles from '../../../styles/create_admin.module.css'
import EditFeedBackCriteria from './editFeedbackCriteria'
const { Option } = Select

const feedbackCriteria = () => {
  const [form] = Form.useForm()
  const [addGroups, setAddGroups] = useState(false)
  const [initialData, setInitialData] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState('')

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'id',
      key: 'name'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Operation',
      key: 'address',
      render: (text, record) => (
        <>
          <Typography.Link onClick={() => handleEdit(record)} style={{ marginRight: '10px' }}>
            <EditOutlined />
          </Typography.Link>
          <Typography.Link onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Typography.Link>
        </>
      )
    }
  ]

  useEffect(async () => {
    const res = await request('/' + get(urls[0], 'CRITERIA'))
    if (res.data) {
      setInitialData(res.data)
    }
  }, [])

  const feedBackCriteriaSubmit = async (values) => {
    const res = await requestPost('/createFeedbackCriteria', values)
    if (res.data) {
      setAddGroups(false)
      const newData = [...initialData, values]
      setInitialData(newData)
      form.resetFields()
    } else {
      console.log('error')
    }
  }

  const callFeedbackWhenEdit = async () => {
    const res = await request('/' + get(urls[0], 'CRITERIA'))
    if (res.data) {
      setInitialData(res.data)
    }
  }

  const handleEdit = (record) => {
    setIsEditing(true)
    setEditId(record.id)
  }

  const handleDelete = async (record) => {
    const result = confirm('Want to delete?')
    if (result) {
      const finalUrl = `/deleteCriteria/${record.id}`
      await requestDelete(finalUrl, 'delete')
      const newData = [...initialData]
      const index = newData.findIndex((item) => record.id === item.id)
      newData.splice(index, 1)
      setInitialData(newData)
    }
  }

  return (
    <div>
      {!isEditing && !addGroups && (
        <>
          <Button style={{ marginBottom: '10px' }} onClick={() => setAddGroups(true)}>
            Add Criteria
          </Button>
          {!isEmpty(initialData) && <Table dataSource={initialData || []} columns={columns} />}
        </>
      )}
      {!isEditing && addGroups && (
        <Form
          {...formItemLayout}
          form={form}
          name='feedback_form'
          onFinish={feedBackCriteriaSubmit}
          scrollToFirstError
          className={styles.create_admin_form}
        >
          <ArrowLeftOutlined
            style={{ fontSize: '20px', color: '#08c', cursor: 'pointer' }}
            onClick={() => {
              setAddGroups(false)
            }}
          />
          <Form.Item
            name='id'
            label='Name'
            rules={[
              {
                required: true
              }
            ]}
          >
            <Input autoComplete='new-name' />
          </Form.Item>
          <Form.Item
            name='type'
            label='Type'
            rules={[
              {
                required: true
              }
            ]}
          >
            <Select style={{ width: 120 }} bordered={false}>
              <Option value='String'>Comments</Option>
              <Option value='Double'>Rating</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Add Criteria
            </Button>
          </Form.Item>
        </Form>
      )}
      {isEditing && <EditFeedBackCriteria id={editId} setIsEditing={setIsEditing} callFeedbackWhenEdit={callFeedbackWhenEdit} />}
    </div>
  )
}

export default feedbackCriteria
