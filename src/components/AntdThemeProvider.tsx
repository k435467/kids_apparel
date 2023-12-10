'use client'

import React from 'react'
import { ConfigProvider } from 'antd'

/**
 * Customize the design token of antd
 *
 * Ref: https://ant.design/docs/react/customize-theme#customize-design-token
 */
const AntdThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffbf00',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntdThemeProvider
