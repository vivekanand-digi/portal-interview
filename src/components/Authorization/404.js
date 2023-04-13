// Packages
import React from 'react'
import { Link } from '../../components/atoms/router-link/router-link'
import { Button } from '../../components/atoms/button/button'
import { Result } from '../../components/atoms/result-antd/result-antd'

function index() {
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button type='primary'>
          <Link to='/'>Back Home</Link>
        </Button>
      }
    />
  )
}

export default index
