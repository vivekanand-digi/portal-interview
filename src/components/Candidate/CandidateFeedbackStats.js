// Packages
import React from 'react'
import { Row, Col, Typography } from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

// Data
import { doughnutData } from '../../fakeData/doughnutChartData'

const { Text } = Typography

ChartJS.register(ArcElement, Tooltip, Legend)

function CandidateFeedbackStats() {
  return (
    <div style={{ marginTop: '100px' }}>
      <Doughnut data={doughnutData} />
      <Row>
        <Col span={18} push={6}>
          <Text type='secondary'>Candidate Feedback statistics</Text>
        </Col>
      </Row>
    </div>
  )
}

export default CandidateFeedbackStats
