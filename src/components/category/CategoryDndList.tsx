import React, { useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { IDocCategory } from '@/types/database'
import { useRouter } from 'next/navigation'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'

const SortableItem: React.FC<{ id: string; category: IDocCategory }> = ({ category, id }) => {
  const router = useRouter()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="touch-none py-4"
        onClick={() => {
          router.push(`/site-settings/categories/${category._id}`)
        }}
      >
        <div>{category.title}</div>
        <div className="mt-2 text-xs font-light text-neutral-400">
          {`${category.display ? '顯示' : '不顯示'}, ${category.productIds.length}個商品`}
        </div>
      </div>
    </div>
  )
}

export const CategoryDndList: React.FC<{ categories: IDocCategory[] }> = ({ categories }) => {
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (over?.id && active.id !== over.id) {
      const oldIndex = items.findIndex((v) => v._id === active.id)
      const newIndex = items.findIndex((v) => v._id === over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
