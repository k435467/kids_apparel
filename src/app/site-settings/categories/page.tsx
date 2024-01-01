'use client'
import React, { useEffect } from 'react'
import { Button, Form, Input, message, Switch, Typography } from 'antd'
import { DeleteOutlined, DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons'

const defaultCategory: ICategory = {
  isOnShelf: true,
  title: '',
}

const CategoriesPage: React.FC<{}> = () => {
  const [form] = Form.useForm()

  const [messageApi, contextHolder] = message.useMessage()

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = (await res.json()) as ICategory[]
      data.sort((a, b) => {
        if (typeof a.order === 'number' && typeof b.order === 'number') {
          return a.order - b.order
        }
        return 1
      })
      form.setFieldsValue({ categories: data })
    } catch (err) {
      console.error(err)
      messageApi.error('初始化失敗')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleFinish = async (value: any) => {
    const currentTime = new Date()
    const categories = value.categories as ICategory[]
    const categoriesWithOrder = categories.map((v, index) => ({
      ...v,
      order: index,
      createTime: v.createTime ?? currentTime,
    }))

    const categoriesWithId = categoriesWithOrder.filter((v) => v._id)
    const categoriesWithoutId = categoriesWithOrder.filter((v) => typeof v._id !== 'string')

    try {
      const promiseOfUpdate =
        categoriesWithId.length > 0
          ? fetch('/api/categories', {
              method: 'PUT',
              body: JSON.stringify(categoriesWithId),
            })
          : null

      const promiseOfInsert =
        categoriesWithoutId.length > 0
          ? fetch('/api/categories', {
              method: 'POST',
              body: JSON.stringify(categoriesWithoutId),
            })
          : null

      const promises = []
      if (promiseOfUpdate) {
        promises.push(promiseOfUpdate)
      }
      if (promiseOfInsert) {
        promises.push(promiseOfInsert)
      }

      await Promise.all([promises])

      setTimeout(() => {
        fetchCategories()
      }, 300)
      messageApi.success('成功')
    } catch (err) {
      console.error(err)
      messageApi.error('失敗')
    }
  }

  return (
    <div className="container mx-auto p-2">
      {contextHolder}
      <Form
        name="categories-form"
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={() => {}}
        autoComplete="off"
        form={form}
      >
        <Form.Item label="商品分類">
          <Form.List name="categories">
            {(fields, { add, remove, move }) => {
              return (
                <>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.key} className="flex">
                        <Form.Item
                          name={[field.name, 'isOnShelf']}
                          valuePropName="checked"
                          initialValue={true}
                        >
                          <Switch size="small" />
                        </Form.Item>
                        <Form.Item name={[field.name, 'title']} className="!ml-1 grow">
                          <Input />
                        </Form.Item>
                        <Button
                          onClick={() => move(index, index - 1)}
                          icon={<UpOutlined />}
                          type="text"
                          size="small"
                          className="ml-1 mt-1"
                        />
                        <Button
                          onClick={() => move(index, index + 1)}
                          icon={<DownOutlined />}
                          type="text"
                          size="small"
                          className="ml-1 mt-1"
                        />
                        <Button
                          onClick={async () => {
                            const item = form.getFieldValue(['categories', field.name]) as ICategory
                            if (item._id) {
                              try {
                                await fetch(`/api/categories/${item._id}`, {
                                  method: 'DELETE',
                                })
                                remove(index)
                                messageApi.success('刪除成功')
                              } catch (err) {
                                console.error(err)
                                messageApi.error('刪除失敗')
                              }
                            }
                          }}
                          icon={<DeleteOutlined />}
                          type="text"
                          size="small"
                          className="ml-4 mt-1"
                        />
                      </div>
                    )
                  })}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add(defaultCategory)}
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            儲存
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

export default CategoriesPage