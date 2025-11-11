'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, toast as sonnerToast } from 'sonner'
import type { ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  const getToastStyle = (type?: string) => {
    const baseStyle = {
      borderRadius: '8px',
      borderLeft: '4px solid',
      fontWeight: '500',
      padding: '16px',
      color: 'white',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }

    switch (type) {
      case 'error':
        return {
          ...baseStyle,
          background: '#ef4444',
          borderLeftColor: '#dc2626',
        }
      case 'success':
        return {
          ...baseStyle,
          background: '#22c55e',
          borderLeftColor: '#16a34a',
        }
      case 'warning':
        return {
          ...baseStyle,
          background: '#eab308',
          borderLeftColor: '#ca8a04',
        }
      case 'info':
        return {
          ...baseStyle,
          background: '#3b82f6',
          borderLeftColor: '#2563eb',
        }
      default:
        return baseStyle
    }
  }

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position="bottom-right"
      duration={4000}
      visibleToasts={3}
      toastOptions={{
        style: getToastStyle(),
      }}
      {...props}
    />
  )
}

export { Toaster, sonnerToast as toast }