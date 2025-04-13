import { toast as toastify } from 'react-toastify'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  description: string
  type?: ToastType
}

export function useToast() {
  const toast = ({ description, type = 'info' }: ToastOptions) => {
    switch (type) {
      case 'success':
        return toastify.success(description)
      case 'error':
        return toastify.error(description)
      case 'warning':
        return toastify.warning(description)
      case 'info':
      default:
        return toastify.info(description)
    }
  }

  return { toast }
} 