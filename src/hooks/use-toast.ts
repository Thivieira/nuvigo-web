import { toast as toastify } from 'react-toastify'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  title?: string
  description: string
  type?: ToastType
}

export function useToast() {
  const toast = ({ title, description, type = 'info' }: ToastOptions) => {
    const content = title ? `${title}\n${description}` : description

    switch (type) {
      case 'success':
        return toastify.success(content)
      case 'error':
        return toastify.error(content)
      case 'warning':
        return toastify.warning(content)
      case 'info':
      default:
        return toastify.info(content)
    }
  }

  return { toast }
} 