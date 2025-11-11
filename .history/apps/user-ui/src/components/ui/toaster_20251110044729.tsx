'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast as sonnerToast } from 'sonner'
import type { ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-md p-4 border-l-4',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          // Custom colors for different toast types
          error: 'border-l-red-500 bg-red-50 text-red-800 border-red-200',
          success: 'border-l-green-500 bg-green-50 text-green-800 border-green-200',
          warning: 'border-l-yellow-500 bg-yellow-50 text-yellow-800 border-yellow-200',
          info: 'border-l-blue-500 bg-blue-50 text-blue-800 border-blue-200',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, sonnerToast as toast }