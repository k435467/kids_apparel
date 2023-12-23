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
          // tailwind: amber-400
          colorPrimary: 'rgb(251, 191, 36)',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AntdThemeProvider
