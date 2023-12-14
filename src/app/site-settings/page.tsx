'use client'
import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd'

type FieldType = {
  name?: string
}

const SiteSettings: React.FC<{}> = () => {
  return (
    <div className="container mx-auto">
      <h1>Categories</h1>
      <Form
        name="create-category"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="off"
        style={{ maxWidth: 600 }}
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SiteSettings
