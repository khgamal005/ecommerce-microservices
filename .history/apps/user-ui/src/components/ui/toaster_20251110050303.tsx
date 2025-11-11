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
      toastOptions={{
        style: {
          borderRadius: '8px',
          borderLeft: '4px solid',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        className: 'sonner-toast',
      }}
      {...props}
    />
  )
}

export { Toaster, sonnerToast as toast }