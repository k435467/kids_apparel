'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, message, Select, Switch, Typography, InputNumber } from 'antd'
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { getFileNames, uploadFilesToBlob } from '@/utils/image'
import UploadListItem from '@/components/product/UploadListItem'
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import dynamic from 'next/dynamic'

// Ref: https://github.com/atlassian/react-beautiful-dnd/issues/2444#issuecomment-1457541204
const Droppable = dynamic(() => import('react-beautiful-dnd').then((res) => res.Droppable), {
  ssr: false,
})

const ProductsCreatePage: React.FC<{}> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [filesUploading, setFilesUploading] = useState<string[]>([])
  const [filesUploaded, setFilesUploaded] = useState<string[]>([])
  const [form] = Form.useForm()

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

  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchCategories()
  }, [])

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
        onFinish={(values) => {
          fetch('/api/products', { method: 'POST', body: JSON.stringify([values]) })
            .then((res) => messageApi.success('成功'))
            .catch((err) => {
              console.error(err)
              messageApi.error('失敗')
            })
        }}
        onFinishFailed={() => {}}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="商品名稱"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="categoryId" label="分類" rules={[{ required: true }]}>
          <Select>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="描述清單">
          <Form.List name="descriptionList">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.key} className="flex">
                        <Form.Item name={[field.name]} className="grow">
                          <Input />
                        </Form.Item>
                        <Button
                          onClick={() => remove(index)}
                          icon={<DeleteOutlined />}
                          type="text"
                          size="small"
                          className="ml-1 mt-1"
                        />
                      </div>
                    )
                  })}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add('')} block icon={<PlusOutlined />}>
                      增加
                    </Button>
                  </Form.Item>
                </>
              )
            }}
          </Form.List>
        </Form.Item>
        <Form.Item label="尺寸">
          <Form.List name="sizes">
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.key} className="flex">
                        <Form.Item name={[field.name, 'size']} className="grow">
                          <Input placeholder="尺寸" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'price']}>
                          <InputNumber placeholder="售價" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'stock']}>
                          <InputNumber placeholder="庫存" />
                        </Form.Item>
                        <Button
                          onClick={() => remove(index)}
                          icon={<DeleteOutlined />}
                          type="text"
                          size="small"
                          className="ml-1 mt-1"
                        />
                      </div>
                    )
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          size: '',
                          stock: null,
                          price: null,
                        })
                      }
                      block
                      icon={<PlusOutlined />}
                    >
                      增加
                    </Button>
                  </Form.Item>
                </>
              )
            }}
          </Form.List>
        </Form.Item>
        <Form.Item name="isOnShelf" label="上架" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default ProductsCreatePage
