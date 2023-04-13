import React, { useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import { Button } from '../../../components/atoms/button/button'
import { get } from 'lodash'
import { createRequest, request } from '../../../services/request'
import { urls } from '../../../services/URLs'
import styles from '../../../styles/create_admin.module.css'
import { ArrowLeftOutlined } from '@ant-design/icons'
const { Option } = Select

const EditFeedBackCriteria = ({ id, setIsEditing, callFeedbackWhenEdit }) => {
  const [form] = Form.useForm()
  const [initData, setinitData] = useState([])

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

  useEffect(() => {
    const finalUrl = '/' + get(urls[0], 'CRITERIA') + `/${id}`
    request(finalUrl).then((res) => {
      setinitData(res.data)
      setinitData((state) => {
        form.setFieldsValue({
          ...state
        })
      })
    }, [])
  }, [])

  const EditFeedBackCriteria = async (values) => {
    const res = await createRequest('/updateCriterias', 'put', values)
    if (res.data) {
      setIsEditing(false)
      callFeedbackWhenEdit()
    }
  }

  return (
    <Form
      {...formItemLayout}
      form={form}
      name='feedback_form'
      onFinish={EditFeedBackCriteria}
      scrollToFirstError
      className={styles.create_admin_form}
    >
      <ArrowLeftOutlined
        style={{ fontSize: '20px', color: '#08c', cursor: 'pointer' }}
        onClick={() => {
          setIsEditing(false)
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
        <Input disabled={true} />
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
          Edit Criteria
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditFeedBackCriteria
