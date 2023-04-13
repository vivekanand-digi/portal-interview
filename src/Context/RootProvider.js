import React, { useState } from 'react'
import { RootContext } from './RootContext'

function RootProvider({ children }) {
  const [count, setCount] = useState(0)
  const [isLogedIn, setIsLogedIn] = useState(false)
  const [userName, setuserName] = useState(false)
  const [interviewerRecord, setInterviewerRecord] = useState({})
  const [getAllInterviewerRecord, setGetAllInterviewerRecord] = useState([])
  const [interviewerDataWhenLogin, setInterviewerDataWhenLogin] = useState({})
  const [getAllCandidate, setGetAllCandidate] = useState([])
  const [role, SetRole] = useState('')
  const [isExternal, setIsExternal] = useState(false)
  const [emails, setEmails] = useState([])

  return (
    <RootContext.Provider
      value={{
        role,
        SetRole,
        count,
        setCount,
        userName,
        setuserName,
        isLogedIn,
        setIsLogedIn,
        isExternal,
        setIsExternal,
        getAllCandidate,
        setGetAllCandidate,
        interviewerRecord,
        setInterviewerRecord,
        getAllInterviewerRecord,
        setGetAllInterviewerRecord,
        interviewerDataWhenLogin,
        setInterviewerDataWhenLogin,
        emails,
        setEmails
      }}
    >
      {children}
    </RootContext.Provider>
  )
}

export default RootProvider
