'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast as sonnerToast } from 'sonner'
import type { ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="bottom-right" // ✅ bottom-right
      duration={4000}
      visibleToasts={3}
      toastOptions={{
        style: {
          borderRadius: '8px',
          borderLeftWidth: '4px',
          fontWeight: '500',
          padding: '16px',
          boxShadow:
            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        classNames: {
          toast: 'flex items-center gap-2',
          description: 'text-sm',
          success: 'bg-green-500 text-white border-green-700',
          error: 'bg-red-500 text-white border-red-700',
          warning: 'bg-yellow-500 text-white border-yellow-700',
          info: 'bg-blue-500 text-white border-blue-700',
          icon: 'text-white',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, sonnerToast as toast }
