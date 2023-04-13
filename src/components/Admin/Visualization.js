// Packages
import React from 'react'
import { Row, Col, Typography } from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie, Doughnut } from 'react-chartjs-2'

// Data
import { pieData } from '../../fakeData/pieChartData'
import { doughnutData } from '../../fakeData/doughnutChartData'

const { Text } = Typography

ChartJS.register(ArcElement, Tooltip, Legend)

function Visualization() {
  return (
    <Row>
      <Col span={10}>
        <Pie data={pieData} />
        <Text type='secondary'>Ant Design (secondary)</Text>
      </Col>
      <Col span={4}>col-8</Col>
      <Col span={10}>
        <Doughnut data={doughnutData} />
        <Text type='secondary'>Ant Design (secondary)</Text>
      </Col>
    </Row>
  )
}

export default Visualization
