import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Form, Input, Typography, Table, Checkbox } from 'antd'
import { Button } from '../../../components/atoms/button/button'
import { get, isEmpty } from 'lodash'

import React, { useState, useEffect } from 'react'
import { request, requestDelete, requestPost } from '../../../services/request'
import { urls } from '../../../services/URLs'
import styles from '../../../styles/create_admin.module.css'
import EditFeedBackGroups from './editFeedbackGroups'

const FeedbackGroups = () => {
  const [form] = Form.useForm()
  const [addGroups, setAddGroups] = useState(false)
  const [initialData, setInitialData] = useState([])
  const [criteriaData, setCriteriaData] = useState([])
  const [checkedList, setCheckedList] = useState([])
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
      title: 'Operation',
      key: 'address',
      render: (text, record) => (
        <>
          <Typography.Link onClick={() => handleEdit(record)} style={{ marginRight: '10px' }}>
            <EditOutlined onClick={() => callCriteria()} />
          </Typography.Link>
          <Typography.Link onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Typography.Link>
        </>
      )
    }
  ]

  const data = []
  criteriaData.map((record) => {
    data.push(record.id)
  })
  const plainOptions = data

  useEffect(async () => {
    const res = await request('/' + get(urls[0], 'CRITERIA'))
    if (res.data) {
      setCriteriaData(res.data)
    }
  }, [])

  useEffect(async () => {
    const res = await request('/' + get(urls[0], 'CRITERIA_GROUP'))
    if (res.data) {
      setInitialData(res.data)
    }
  }, [])

  const callCriteria = async () => {
    const res = await request('/' + get(urls[0], 'CRITERIA'))
    if (res.data) {
      setCriteriaData(res.data)
    }
  }

  const handleDelete = async (record) => {
    const result = confirm('Want to delete?')
    if (result) {
      const finalUrl = `/deleteCriteriaGroup/${record.id}`
      await requestDelete(finalUrl, 'delete')
      const newData = [...initialData]
      const index = newData.findIndex((item) => record.id === item.id)
      newData.splice(index, 1)
      setInitialData(newData)
    }
  }

  const handleEdit = (record) => {
    setIsEditing(true)
    setEditId(record.id)
  }

  const feedbackGroupSubmit = async (values) => {
    const payload = {
      id: values.id,
      criteriaIds: checkedList
    }
    const res = await requestPost('/createFeedbackGroups', payload)
    if (res.data === '') {
      setAddGroups(false)
      const newData = [...initialData, values]
      setInitialData(newData)
      form.resetFields()
    } else {
      console.log('error')
    }
  }

  const callFeedbackWhenEdit = async () => {
    const res = await request('/' + get(urls[0], 'CRITERIA_GROUP'))
    if (res.data) {
      setInitialData(res.data)
    }
  }

  const onChange = (e) => {
    setCheckedList(e)
  }

  return (
    <div>
      {!isEditing && !addGroups && (
        <>
          <Button
            onClick={() => {
              setAddGroups(true)
              callCriteria()
            }}
            style={{ marginBottom: '10px' }}
          >
            Add Groups
          </Button>
          {!isEmpty(initialData) && <Table dataSource={initialData || []} columns={columns} />}
        </>
      )}
      {!isEditing && addGroups && (
        <Form
          {...formItemLayout}
          form={form}
          name='create_feedbackGroup_form'
          onFinish={feedbackGroupSubmit}
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
            label='please check required'
            rules={[
              {
                required: true
              }
            ]}
          >
            <Checkbox.Group options={plainOptions} onChange={onChange}>
              Checkbox
            </Checkbox.Group>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Add Group
            </Button>
          </Form.Item>
        </Form>
      )}
      {isEditing && (
        <EditFeedBackGroups
          id={editId}
          setIsEditing={setIsEditing}
          callFeedbackWhenEdit={callFeedbackWhenEdit}
          plainOptions={plainOptions}
        />
      )}
    </div>
  )
}

export default FeedbackGroups
