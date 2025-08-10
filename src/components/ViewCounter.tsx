'use client'

import { useEffect, useState } from 'react'

interface ViewCounterProps {
  entryId: string
  initialViews: number
}

export default function ViewCounter({ entryId, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    // Инкрементируем счетчик просмотров
    fetch(`/api/entries/${entryId}/views`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.views) {
          setViews(data.views)
        }
      })
      .catch(() => {
        // Игнорируем ошибки
      })
  }, [entryId])

  return <span className="text-gray-500 dark:text-gray-400 text-xs xs:text-sm">Просмотров: {views}</span>
}