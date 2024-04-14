'use client'
import React, { useRef, useState } from 'react'
import { Button, message } from 'antd'
import { blobImagePath, uploadFilesToBlob } from '@/utils/image'
import { UploadOutlined } from '@ant-design/icons'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableItem: React.FC<{
  imageName: string
  onClick: (imageName: string) => void
}> = ({ imageName, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: imageName,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="cursor-move touch-none rounded-lg border border-solid border-gray-200 bg-white p-1"
        onClick={() => onClick(imageName)}
      >
        <img src={`${blobImagePath}${imageName}`} alt="" className="h-20 w-20 object-contain" />
      </div>
    </div>
  )
}

const SortableSection: React.FC<{ imageNames: string[]; onChange?: (v: string[]) => void }> = ({
  imageNames,
  onChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // For sortable item clicks to work
      },
    }),
  )

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over?.id && active.id !== over.id) {
      const oldIndex = imageNames.indexOf(active.id as string)
      const newIndex = imageNames.indexOf(over.id as string)
      onChange?.(arrayMove(imageNames, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={imageNames} strategy={rectSortingStrategy}>
        {imageNames.map((v) => (
          <SortableItem
            key={v}
            imageName={v}
            onClick={(x) => {
              console.log(x)
            }}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}

type ProductImageUploaderProps =
  | {
      mode: 'single'
      value?: string
      onChange?: (v: string) => void
    }
  | {
      mode: 'multiple'
      value?: string[]
      onChange?: (v: string[]) => void
    }

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  mode,
  value,
  onChange,
}) => {
  const [messageApi, contextHolder] = message.useMessage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleUploadImage = () => {
    // Extract files
    const files = fileInputRef.current?.files
    if (!files || files.length === 0) return

    // Upload
    setIsLoading(true)
    uploadFilesToBlob(files)
      .then((fileNames) => {
        if (mode === 'single') onChange?.(fileNames[0])
        else onChange?.([...(value ? value : []), ...fileNames])
        messageApi.success(`成功上傳${fileNames.length}張圖片`)
      })
      .catch((err) => {
        messageApi.error(`上傳失敗`)
        if (err instanceof Error) {
          messageApi.error(err.message)
        }
      })
      .finally(() => {
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setIsLoading(false)
      })
  }

  return (
    <div>
      <input
        className="!hidden"
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg, image/png, image/webp"
        onChange={handleUploadImage}
      />
      <Button
        loading={isLoading}
        icon={<UploadOutlined />}
        onClick={() => fileInputRef.current?.click()}
      >
        上傳商品圖片
      </Button>

      <div className="mt-2 flex flex-wrap gap-2">
        <SortableSection
          imageNames={value ? (mode === 'single' ? [value] : value) : []}
          onChange={mode === 'multiple' ? onChange : undefined}
        />
      </div>
    </div>
  )
}
