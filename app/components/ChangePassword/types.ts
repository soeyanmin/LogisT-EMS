export interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: ChangePasswordForm) => Promise<void>
}

export interface PasswordValidation {
  hasMinLength: boolean
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}
