import React, { useEffect, useState } from 'react'
import { Form, Input, Checkbox } from 'antd'
import { Button } from '../../../components/atoms/button/button'
import { get, isEmpty } from 'lodash'
import { createRequest, request } from '../../../services/request'
import { urls } from '../../../services/URLs'
import styles from '../../../styles/create_admin.module.css'
import { ArrowLeftOutlined } from '@ant-design/icons'

const EditFeedBackGroups = ({ id, setIsEditing, callFeedbackWhenEdit, plainOptions }) => {
  const [form] = Form.useForm()
  const [initData, setinitData] = useState([])
  const [preSelected, setPreSelected] = useState([])

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

  const defaultSelected = []
  !isEmpty(preSelected) &&
    preSelected.map((record) => {
      defaultSelected.push(record.id)
    })

  useEffect(() => {
    request('/' + get(urls[0], 'CRITERIA_GROUP') + `/${id}`).then((res) => {
      setinitData(res.data)
      setinitData((state) => {
        setPreSelected(state.criterias)
      })
      const criteriaGroup = res.data.criterias.map((item) => item.id)
      form.setFieldsValue({
        ...res.data,
        type: criteriaGroup || []
      })
    }, [])
  }, [])

  const EditFeedBackCriteria = async (values) => {
    const payload = {
      id: values.id,
      criteriaIds: values.type
    }
    const res = await createRequest('/updateGroups', 'put', payload)
    if (res.data === '') {
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
        label='please check required'
        rules={[
          {
            required: true
          }
        ]}
      >
        <Checkbox.Group defaultValue={defaultSelected} options={plainOptions} checked={defaultSelected}>
          Checkbox
        </Checkbox.Group>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type='primary' htmlType='submit'>
          Edit Group
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditFeedBackGroups
