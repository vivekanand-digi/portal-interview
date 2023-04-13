import React from 'react'
import { ReactMultiEmail } from 'react-multi-email'
import 'react-multi-email/style.css'

const MultiEmailInput = ({ emails, setEmails }) => {
  return (
    <ReactMultiEmail
      placeholder='Input your Email Address'
      emails={emails}
      onChange={(_emails) => setEmails(_emails)}
      getLabel={(email, index, removeEmail) => {
        return (
          <div data-tag key={index}>
            {email}
            <span data-tag-handle onClick={() => removeEmail(index)}>
              ×
            </span>
          </div>
        )
      }}
    />
  )
}

export default MultiEmailInput
