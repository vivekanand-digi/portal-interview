import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import { map } from 'lodash'
// View
import CandidateLists from './CandidateLists'

function Interviewer() {
  const { TabPane } = Tabs

  // Tabs
  const TABS = [
    {
      tab: 'Cadidate Dashboard',
      Component: CandidateLists
    }
  ]

  const [activeTab, setActiveTab] = useState('')

  useEffect(() => {
    setActiveTab(TABS[0].tab)
  }, [])

  return (
    <>
      <Tabs
        tabPosition='left'
        onChange={(id) => {
          setActiveTab(id)
        }}
      >
        {map(TABS, (TAB, index) => {
          return (
            <TabPane tab={TAB.tab} key={index}>
              {activeTab == TAB.tab ? <TAB.Component /> : null}
            </TabPane>
          )
        })}
      </Tabs>
    </>
  )
}

export default Interviewer
