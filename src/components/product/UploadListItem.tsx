import React from 'react'
import { blobImagePath } from '@/utils/image'
import { Button, Spin } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const UploadListItem: React.FC<{
  fileName: string
  type: 'done' | 'uploading'
  onDelete: () => void
}> = ({ fileName, type, onDelete }) => {
  return (
    <div
      key={fileName}
      className={`${
        type === 'done' ? 'border-solid' : 'border-dashed'
      } mt-2 flex min-h-[66px] items-center rounded-lg border border-gray-300 p-2`}
    >
      {type === 'done' && <img className="h-12 w-12" src={blobImagePath + fileName} alt="" />}
      {type === 'uploading' && (
        <div className="flex h-12 w-12 items-center justify-center">
          <Spin size="small" />
        </div>
      )}
      <div className="grow overflow-hidden overflow-ellipsis break-all px-2 text-sm">
        {fileName}
      </div>
      <Button onClick={onDelete} icon={<DeleteOutlined />} type="text" size="small" />
    </div>
  )
}

export default UploadListItem
