// Packages
import React, { useContext, useMemo, useState } from 'react'
import { RootContext } from '../../Context/RootContext'

import { Tabs, Drawer } from 'antd'
import { map } from 'lodash'
import feedback from '../../pages/feedback'

// View
import CandidateForm from './CandidateForm'
import CandidateLists from './CandidateLists'

import InterviewerForm from './InterviewerForm'
import { getFromLocal } from '../../utils/storage/index'
import { useLocation, useHistory } from 'react-router-dom'

const { TabPane } = Tabs
const external = getFromLocal('external')

function Candidate() {
  let location = useLocation()
  const history = useHistory()
  const { isExternal } = useContext(RootContext)
  const [activeTab, setActiveTab] = useState('')
  const [activeLink, setActiveLink] = useState('')
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  // Tabs
  let TABS =
    // isExternal === 'true' || external
      0 ? [
          {
            tab: 'Candidate Dashboard',
            Component: CandidateLists,
            mapping: 'candidateList',
            routeUrl: '/admin/candidateList'
          },
          {
            tab: 'Create Candidate',
            Component: CandidateForm,
            mapping: 'candidateCreate',
            routeUrl: '/admin/candidateCreate'
          }
        ]
      : [
          {
            tab: 'Candidate Dashboard',
            Component: CandidateLists,
            mapping: 'candidateList',
            routeUrl: '/admin/candidateList'
          },
          {
            tab: 'Create Candidate',
            Component: CandidateForm,
            mapping: 'candidateCreate',
            routeUrl: '/admin/candidateCreate'
          },
          {
            tab: 'Manage System Users',
            Component: InterviewerForm,
            mapping: 'manageSystemUsers',
            routeUrl: '/admin/manageSystemUsers'
          },
          {
            tab: 'Manage Feedback Criteria',
            Component: feedback,
            mapping: 'manageFeedbackCriteria',
            routeUrl: '/admin/manageFeedbackCriteria'
          }
        ]

  useMemo(() => {
    let pathname = location.pathname
    TABS.map((view) => {
      if (pathname.includes(view.routeUrl)) {
        setActiveTab(view.tab)
        setActiveLink(view.routeUrl)
      }
    })
  }, [location.pathname])

  return (
    <div className='ant-row'>
      <div className='ant-col-xs-4 ant-col-md-0' onClick={showDrawer}>
        <div className='bar1'></div>
        <div className='bar2'></div>
        <div className='bar3'></div>
      </div>
      <Drawer
        title='DigiSprint Recruitment Portal'
        className='ant-col-md-0'
        width={'300px'}
        placement='right'
        onClose={onClose}
        visible={visible}
      >
        <Tabs
          defaultActiveKey={activeLink}
          tabPosition='left'
          className='ant-col-xs-24'
          onChange={(id) => {
            history.push(id)
            onClose()
          }}
        >
          {map(TABS, (TAB) => {
            return <TabPane tab={TAB.tab} key={TAB.routeUrl} className='candidateList'></TabPane>
          })}
        </Tabs>
      </Drawer>
      <Tabs
        defaultActiveKey={activeLink}
        tabPosition='left'
        className='ant-col-xs-0 ant-col-md-6 ant-col-lg-4'
        onChange={(id) => {
          history.push(id)
        }}
      >
        {map(TABS, (TAB) => {
          return <TabPane tab={TAB.tab} key={TAB.routeUrl} className='candidateList'></TabPane>
        })}
      </Tabs>
      {map(TABS, (TAB) => {
        return (
          <>
            {activeTab == TAB.tab ? (
              <div className='ant-col-xs-24 ant-col-md-18 ant-col-lg-20'>
                <TAB.Component />
              </div>
            ) : null}
          </>
        )
      })}
    </div>
  )
}

export default Candidate
