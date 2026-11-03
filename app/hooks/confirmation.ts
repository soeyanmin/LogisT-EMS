// types/confirmation.ts
export interface ConfirmationState {
  visible: boolean
  title: string
  message: string
  resolve: ((value: boolean) => void) | null
  options?: ConfirmationOptions
}

export interface ConfirmationOptions {
  confirmText?: string
  cancelText?: string
  type?: "default" | "danger" | "warning"
  confirmColor?: string
  cancelColor?: string
}

export interface ConfirmationContextType {
  showConfirmation: (
    title: string,
    message: string,
    options?: ConfirmationOptions,
  ) => Promise<boolean>
}
