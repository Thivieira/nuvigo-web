'use client'

import React from 'react'

interface ToastContentProps {
  title?: string
  description: string
}

export function ToastContent({ title, description }: ToastContentProps) {
  return (
    <div>
      {title && <div className="font-semibold">{title}</div>}
      <div className="text-sm opacity-90">{description}</div>
    </div>
  )
} 