// hooks/useToast.ts
import { useMessage } from "@/context/MessageContext"

export const useToast = () => {
  const { showMessage } = useMessage()

  const showSuccess = (title: string, message?: string, duration?: number) => {
    showMessage({
      type: "success",
      title,
      message,
      duration: duration || 3000,
    })
  }

  const showError = (title: string, message?: string, duration?: number) => {
    showMessage({
      type: "error",
      title,
      message,
      duration: duration || 4000,
    })
  }

  const showWarning = (title: string, message?: string, duration?: number) => {
    showMessage({
      type: "warning",
      title,
      message,
      duration: duration || 3000,
    })
  }

  const showInfo = (title: string, message?: string, duration?: number) => {
    showMessage({
      type: "info",
      title,
      message,
      duration: duration || 3000,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
