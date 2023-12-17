'use client'
import React, { useRef, useState } from 'react'
import { Button, Checkbox, Form, Input, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getFileNames, uploadFilesToBlob } from '@/utils/image'
import UploadListItem from '@/components/product/UploadListItem'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import dynamic from 'next/dynamic'

// Ref: https://github.com/atlassian/react-beautiful-dnd/issues/2444#issuecomment-1457541204
const Droppable = dynamic(() => import('react-beautiful-dnd').then((res) => res.Droppable), {
  ssr: false,
})

type FieldType = {
  name?: string
}

const SiteSettings: React.FC<{}> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filesUploading, setFilesUploading] = useState<string[]>([])
  const [filesUploaded, setFilesUploaded] = useState<string[]>([
    'Screenshot%202023-12-02%20at%2013.35.56.png',
    'Screenshot%202023-12-02%20at%2014.35.56.png',
    'Screenshot%202023-12-02%20at%2015.35.56.png',
  ])

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = [...filesUploaded]
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFilesUploaded(items)
  }

  // const [isBrowser, setIsBrowser] = useState(false)
  //
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setIsBrowser(true)
  //   }
  // }, [])

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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="files-uploaded">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {filesUploaded.map((fileName, index) => (
                  <Draggable key={fileName} draggableId={fileName} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <UploadListItem fileName={fileName} onDelete={() => {}} type="done" />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/*----*/}
        {/*<div>*/}
        {/*  {filesUploading.map((fileName) => {*/}
        {/*    return (*/}
        {/*      <UploadListItem fileName={fileName} type="done" key={fileName} onDelete={() => {}} />*/}
        {/*    )*/}
        {/*  })}*/}
        {/*</div>*/}
        <div>
          {filesUploading.map((fileName) => {
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
