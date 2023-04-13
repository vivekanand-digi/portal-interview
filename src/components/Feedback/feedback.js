import React from 'react'

import { Tabs } from 'antd'
import FeedbackCriteria from './FeedbackCriteria/feedbackCriteria'
import FeedbackGroups from './FeedbackGroup/FeedbackGroups'

const { TabPane } = Tabs

const Feedback = () => (
  <Tabs defaultActiveKey='1'>
    <TabPane tab={<span>Feedback Groups</span>} key='1'>
      <FeedbackGroups />
    </TabPane>
    <TabPane tab={<span>Feedback Criteria</span>} key='2'>
      <FeedbackCriteria />
    </TabPane>
  </Tabs>
)

export default Feedback
