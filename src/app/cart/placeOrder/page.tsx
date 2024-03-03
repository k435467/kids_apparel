'use client'
import React, { useState } from 'react'
import { ShipMethodType } from '@/utils/misc'

const highlighted = '!border-amber-400 !font-bold text-amber-400'

/**
 * 下單頁面
 * 1. 選擇物流方式：超商取貨, 宅配
 * 2. 收件人資訊
 */
export default function PlaceOrderPage({}: {}) {
  const [shipMethod, setShipMethod] = useState<ShipMethodType>('7-11')

  return (
    <div className="m-4 mb-20">
      <div>物流方式：</div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {(['7-11', '全家', '宅配'] as ShipMethodType[]).map((v) => (
          <div
            key={v}
            className={`flex cursor-pointer items-center justify-center rounded-lg p-4 font-light ${shipMethod === v && highlighted}`}
            style={{ border: '1px solid rgba(0,0,0,.3)' }}
            onClick={() => setShipMethod(v)}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}
