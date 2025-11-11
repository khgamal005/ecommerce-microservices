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
      duration={4000}
      visibleToasts={3}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Base toast styles
          toast:
            'group toast group-[.toaster]:shadow-lg rounded-lg p-4 border-l-4 font-medium',
          description: 'text-sm opacity-90 mt-1',
          actionButton: 'text-xs font-bold',
          cancelButton: 'text-xs font-bold',
          
          // Type-specific styles
          error: 'border-l-red-500 bg-red-500 text-white',
          success: 'border-l-green-500 bg-green-500 text-white',
          warning: 'border-l-yellow-500 bg-yellow-500 text-white',
          info: 'border-l-blue-500 bg-blue-500 text-white',
          
          // Icon colors
          icon: 'text-white',
        },
        style: {
          borderRadius: '8px',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, sonnerToast as toast }