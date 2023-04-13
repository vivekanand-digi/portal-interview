// Packages
import React from 'react'
import { Link } from '../../components/atoms/router-link/router-link'
import { Button } from '../../components/atoms/button/button'
import { Result } from '../../components/atoms/result-antd/result-antd'

function index() {
  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
      extra={
        <Button type='primary'>
          <Link to='/'>Back Home</Link>
        </Button>
      }
    />
  )
}

export default index
