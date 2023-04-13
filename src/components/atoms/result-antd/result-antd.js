import React from 'react'
import { Result as ResultAntd } from 'antd'

export const Result = ({ status, title, subTitle, extra }) => {
  return <ResultAntd status={status} title={title} subTitle={subTitle} extra={extra} />
}
