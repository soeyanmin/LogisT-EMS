/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react"

import { PasswordValidation } from "./types"

export const usePasswordValidation = (password: string) => {
  const validation: PasswordValidation = useMemo(
    () => ({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    }),
    [password],
  )

  const isValid = useMemo(() => Object.values(validation).every(Boolean), [validation])

  return { validation, isValid }
}
