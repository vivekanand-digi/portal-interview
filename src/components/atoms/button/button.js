import React from 'react'
import { Button as ButtonAntd } from 'antd'

export const Button = ({ key, style, type, children, htmlType, disabled, className, onClick = () => {}, href, size, shape, danger }) => {
  return (
    <ButtonAntd
      key={key}
      danger={danger}
      style={style}
      shape={shape}
      href={href}
      size={size}
      type={type}
      htmlType={htmlType}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      {children}
    </ButtonAntd>
  )
}
