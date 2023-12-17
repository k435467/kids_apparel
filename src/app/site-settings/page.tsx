'use client'
import React, { useRef, useState } from 'react'
import { Button, Checkbox, Form, Input, message, Spin } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getFileNames, uploadFilesToBlob } from '@/utils/image'
import UploadListItem from '@/components/product/UploadListItem'

type FieldType = {
  name?: string
}

const testFileNames = [
  'Screenshot%202023-12-02%20at%2013.35.56.png',
  'Screenshot%202023-12-02%20at%2014.35.56.png',
  'Screenshot%202023-12-02%20at%2015.35.56.png',
]

const SiteSettings: React.FC<{}> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filesUploading, setFilesUploading] = useState<string[]>([])
  const [filesUploaded, setFilesUploaded] = useState<string[]>([])

  const [messageApi, contextHolder] = message.useMessage()

  const handleUploadImage = () => {
    const files = fileInputRef.current?.files
    if (!files || files.length === 0) return

    // clear files preventing upload the files again next time
    fileInputRef.current.value = ''

    const fileNames = getFileNames(files)
    setFilesUploading((v) => [...v, ...fileNames])

    uploadFilesToBlob(files)
      .then((fileNames) => {
        setFilesUploading((v) => v.filter((x) => !fileNames.includes(x)))
        setFilesUploaded((v) => [...v, ...fileNames])
        messageApi.success(`成功上傳${fileNames.length}張圖片`)
      })
      .catch((err) => {
        setFilesUploading((v) => v.filter((x) => !fileNames.includes(x)))
        messageApi.success(`上傳${fileNames.length}張圖片失敗`)
      })
  }

  return (
    <div className="container mx-auto p-2">
      {contextHolder}
      <h1>Categories</h1>
      <div className="mt-2">
        <input
          hidden
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          onChange={handleUploadImage}
        />
        <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
          上傳商品圖片
        </Button>
        <div>
          {testFileNames.map((fileName) => {
            return (
              <UploadListItem fileName={fileName} type="done" key={fileName} onDelete={() => {}} />
            )
          })}
        </div>
        <div>
          {testFileNames.map((fileName) => {
            return (
              <UploadListItem
                fileName={fileName}
                type="uploading"
                key={fileName}
                onDelete={() => {}}
              />
            )
          })}
        </div>
      </div>
      <Form
        name="create-category"
        layout="vertical"
        onFinish={() => {}}
        onFinishFailed={() => {}}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="商品名稱"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isOnShelf">
          <Checkbox>上架</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SiteSettings
