import React, { useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { IDocCategory } from '@/types/database'
import { useRouter } from 'next/navigation'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { PauseOutlined } from '@ant-design/icons'
import { mutate } from 'swr'
import { message } from 'antd'

const SortableItem: React.FC<{ id: string; category: IDocCategory }> = ({ category, id }) => {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className="flex touch-none py-4"
        onClick={() => {
          router.push(`/site-settings/categories/${category._id}`)
        }}
      >
        <div className="grow">
          <div>{category.title}</div>
          <div className="mt-2 text-xs font-light text-neutral-400">
            {`${category.display ? '顯示' : '不顯示'}, ${category.productIds.length}個商品`}
          </div>
        </div>
        <div className="flex items-center px-2" ref={setActivatorNodeRef} {...listeners}>
          <PauseOutlined rotate={90} style={{ color: 'rgba(0,0,0,.5)' }} />
        </div>
      </div>
    </div>
  )
}

export const CategoryDndList: React.FC<{ categories: IDocCategory[] }> = ({ categories }) => {
  const [messageApi, contextHolder] = message.useMessage()
  const [items, setItems] = useState<IDocCategory[]>([])

  useEffect(() => {
    setItems(categories)
  }, [categories])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // For sortable item clicks to work
      },
    }),
  )

  const patchCategorySorts = (newItems: IDocCategory[]) =>
    fetch('/api/categories', {
      method: 'PATCH',
      body: JSON.stringify(
        newItems.map((v, index) => ({
          _id: v._id,
          sort: index + 1,
        })),
      ),
    })
      .then(() => {
        messageApi.success('成功')
      })
      .catch(() => {
        messageApi.error('失敗')
      })

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over?.id && active.id !== over.id) {
      const oldIndex = items.findIndex((v) => v._id === active.id)
      const newIndex = items.findIndex((v) => v._id === over.id)
      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      mutate('/api/categories', patchCategorySorts(newItems), {
        optimisticData: newItems,
        revalidate: false,
        populateCache: false,
        throwOnError: false,
      })
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {contextHolder}
      <SortableContext
        items={items.map((v) => ({
          id: v._id as string,
        }))}
        strategy={rectSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem category={item} id={item._id as string} key={item._id as string} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
