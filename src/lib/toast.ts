import { toast as toastify } from 'react-toastify'

type ToastOptions = {
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

export const toast = (message: string, options: ToastOptions = {}) => {
  const { type = 'info', duration = 5000 } = options

  switch (type) {
    case 'success':
      return toastify.success(message, { autoClose: duration })
    case 'error':
      return toastify.error(message, { autoClose: duration })
    case 'warning':
      return toastify.warning(message, { autoClose: duration })
    default:
      return toastify.info(message, { autoClose: duration })
  }
} 