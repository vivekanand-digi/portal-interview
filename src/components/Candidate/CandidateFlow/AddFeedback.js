import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Radio, Rate } from 'antd'
import { Button } from '../../../components/atoms/button/button'
const { TextArea } = Input
import { request } from '../../../services/request'
import { get, isEmpty } from 'lodash'
import { urls } from '../../../services/URLs'

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

function CandidateFeedbackForm(props) {
  const [form] = Form.useForm()
  const nextaction = props.NextactionValues || []
  const [criterias, setcriteria] = useState(null)
  const onFinish = (values) => {
    let feedback = {}
    for (const key in values) {
      if (!(key == 'feedback' || key == 'roundStatus')) {
        feedback[key] = values[key]
      }
    }
    props.OnSubmitFeedack(feedback)
  }
  const Nextaction = nextaction.map((value, key) => {
    if (
      value === 'RescheduleRound1' ||
      value === 'RescheduleRound2' ||
      value === 'RescheduleHr' ||
      value === 'OnHold' ||
      value === 'Drop'
    ) {
      return null
    }
    return (
      <Radio key={key} id={key} value={value}>
        {value}
      </Radio>
    )
  })

  useEffect(async () => {
    const finalurl = '/' + get(urls[0], 'CRITERIA_GROUP') + '/' + props.criteriaGroup
    const res = await request(finalurl)
    setcriteria(res.data)
  }, [])

  const getCriterias =
    !isEmpty(criterias) &&
    criterias.criterias.map((value) => {
      return (
        <>
          {value.type === 'String' ? (
            <Form.Item
              name={value.id}
              label={value.id}
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Form.Item
              name={value.id}
              label={value.id}
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Rate allowHalf />
            </Form.Item>
          )}
        </>
      )
    })

  return (
    <Row>
      <Col span={24}>
        <h2>Round Feedback</h2>

        <Form {...formItemLayout} form={form} name='add_feedback_form' onFinish={onFinish} style={{ width: '80%' }}>
          {getCriterias}

          <Form.Item
            name='feedback'
            label='Feedback'
            rules={[
              {
                required: true,
                message: 'Please Enter Feedback !'
              }
            ]}
          >
            <TextArea
              rows={4}
              onChange={(e) => {
                props.OnchangeFeedbackComments(e)
              }}
            />
          </Form.Item>

          <Form.Item
            name='roundStatus'
            label='Round Status'
            rules={[
              {
                required: true,
                message: 'Please Enter Feedback !'
              }
            ]}
          >
            <Radio.Group value='' onChange={(e) => props.OnChangeRoundtatus(e)}>
              {Nextaction}
            </Radio.Group>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button type='primary' htmlType='submit'>
              Submit Feedback
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default CandidateFeedbackForm
