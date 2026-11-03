// hooks/useConfirmation.ts
import { useState, useCallback } from "react"

import { ConfirmationState, ConfirmationOptions } from "./confirmation"

export const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    visible: false,
    title: "",
    message: "",
    resolve: null,
    options: undefined,
  })

  const showConfirmation = useCallback(
    (title: string, message: string, options?: ConfirmationOptions): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        setConfirmationState({
          visible: true,
          title,
          message,
          resolve,
          options,
        })
      })
    },
    [],
  )

  const hideConfirmation = useCallback(
    (result: boolean) => {
      if (confirmationState.resolve) {
        confirmationState.resolve(result)
      }
      setConfirmationState({
        visible: false,
        title: "",
        message: "",
        resolve: null,
        options: undefined,
      })
    },
    [confirmationState],
  )

  return {
    showConfirmation,
    hideConfirmation,
    confirmationState,
  }
}
