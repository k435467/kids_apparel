'use client'
import React, { useState } from 'react'
import { Button, ConfigProvider, Form, Input, Segmented, message } from 'antd'
import type { FormItemProps } from 'antd'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

type FieldType = {
  phoneNumber: string
  password: string
  verifyPassword: string
  userName: string
}

const fieldRules: { [K in keyof FieldType]: FormItemProps['rules'] } = {
  phoneNumber: [{ required: true, min: 10, max: 12 }],
  password: [
    { required: true, min: 6, max: 20 },
    { pattern: /^[0-9a-zA-Z]+$/, message: '請使用數字及英文字母' },
  ],
  verifyPassword: [{ required: true, min: 6, max: 20 }],
  userName: [{ required: true, max: 10 }],
}

const SignInForm: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const handleSubmit = (values: FieldType) => {
    signIn('credentials', {
      redirect: false,
      phoneNumber: values.phoneNumber,
      password: values.password,
    })
      .then((res) => {
        if (!res?.ok) throw new Error(res?.status.toString())
        messageApi.success('成功，導向首頁...')
        setTimeout(() => {
          router.replace('/')
        }, 1000)
      })
      .catch((err) => {
        messageApi.error('失敗')
      })
  }

  return (
    <Form
      name="sign-in-form"
      layout="vertical"
      onFinish={handleSubmit}
      onFinishFailed={() => {
        messageApi.warning('請檢查輸入欄位')
      }}
      className={`${!isActive && 'pointer-events-none opacity-0'}`}
    >
      {contextHolder}
      <Form.Item<FieldType>
        name="phoneNumber"
        label="手機號碼"
        validateTrigger="onBlur"
        rules={fieldRules.phoneNumber}
      >
        <Input type="number" autoComplete="tel-local" />
      </Form.Item>
      <Form.Item<FieldType>
        name="password"
        label="密碼"
        validateTrigger="onBlur"
        tooltip="6~20位的數字及英文字母"
        rules={fieldRules.password}
      >
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Button block className="mt-4" type="primary" htmlType="submit">
        登入
      </Button>
    </Form>
  )
}

const SignUpForm: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const router = useRouter()

  const [messageApi, contextHolder] = message.useMessage()

  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const handleSubmit = (values: FieldType) => {
    if (values.verifyPassword !== values.password) {
      messageApi.warning('確認密碼與密碼不符')
    }
    const copyValues: Partial<FieldType> = { ...values }
    delete copyValues.verifyPassword
    setSubmitting(true)
    fetch('/api/member/sign-up', { method: 'POST', body: JSON.stringify(copyValues) })
      .then(async (res) => {
        if (!res.ok) {
          const message = await res.json()
          throw new Error(message)
        }
        messageApi.success('成功，自動登入中...')
        setTimeout(() => {
          signIn('credentials', {
            redirect: false,
            phoneNumber: copyValues.phoneNumber,
            password: copyValues.password,
          })
            .then((res) => {
              if (!res?.ok) throw new Error(res?.status.toString())
              messageApi.success('成功，導向首頁...')
              setTimeout(() => {
                router.replace('/')
              }, 1000)
            })
            .catch((err) => {
              messageApi.error('失敗')
            })
            .finally(() => {
              setSubmitting(false)
            })
        }, 2000)
      })
      .catch((err: Error | undefined) => {
        if (err?.message) messageApi.error(err.message)
        messageApi.error('失敗。如果該狀況持續請聯繫管理員')
        setSubmitting(false)
      })
  }

  return (
    <Form
      name="sign-up-form"
      layout="vertical"
      onFinishFailed={() => {
        messageApi.warning('請檢查輸入欄位')
      }}
      onFinish={handleSubmit}
      className={`${!isActive && 'pointer-events-none opacity-0'}`}
    >
      {contextHolder}
      <Form.Item<FieldType>
        name="phoneNumber"
        label="手機號碼"
        validateTrigger="onBlur"
        rules={fieldRules.phoneNumber}
      >
        <Input type="number" autoComplete="tel-local" />
      </Form.Item>
      <Form.Item<FieldType>
        name="password"
        label="密碼"
        validateTrigger="onBlur"
        tooltip="6~20位的數字及英文字母"
        rules={fieldRules.password}
      >
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </Form.Item>
      <Form.Item<FieldType>
        name="verifyPassword"
        label="確認密碼"
        validateTrigger="onBlur"
        tooltip="請再輸入一次密碼"
        rules={fieldRules.verifyPassword}
      >
        <Input.Password
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item<FieldType>
        name="userName"
        label="姓名/暱稱"
        validateTrigger="onBlur"
        rules={fieldRules.userName}
      >
        <Input type="text" autoComplete="off" />
      </Form.Item>
      <Button block className="mt-4" type="primary" htmlType="submit" loading={isSubmitting}>
        註冊
      </Button>
    </Form>
  )
}

/**
 * 登入及註冊頁面
 */
export default function ({}) {
  const [signInOrSignUp, setSignInOrSignUp] = useState<'signIn' | 'signUp'>('signIn')

  return (
    <div className="p-8">
      <ConfigProvider
        form={{
          validateMessages: {
            required: '必填',
            string: {
              max: '長度超過${max}個字元',
              range: '長度必須在${min}~${max}個字元',
            },
          },
          requiredMark: false,
        }}
      >
        <Segmented
          block
          options={[
            { label: '登入', value: 'signIn' },
            { label: '註冊', value: 'signUp' },
          ]}
          className="!mb-8"
          onChange={(value) => setSignInOrSignUp(value as any)}
        />
        <div className={`flex flex-col ${signInOrSignUp === 'signUp' && 'flex-col-reverse'}`}>
          <SignInForm isActive={signInOrSignUp === 'signIn'} />
          <SignUpForm isActive={signInOrSignUp === 'signUp'} />
        </div>
      </ConfigProvider>
    </div>
  )
}
