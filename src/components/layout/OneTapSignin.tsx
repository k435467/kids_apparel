'use client'
import React from 'react'
import { useOneTapSignin } from '@/utils/auth/useOneTapSignin'

export default function ({}) {
  const { isLoading: oneTapIsLoading } = useOneTapSignin({
    redirect: false,
    parentContainerId: 'oneTap',
  })
  return <div id="oneTap" className="fixed right-0 top-0 z-[100]" />
}
