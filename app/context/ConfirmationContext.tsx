/* eslint-disable no-restricted-imports */
// context/ConfirmationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react"

import ConfirmationModal from "../components/ConfirmationModal"
import {
  ConfirmationState,
  ConfirmationOptions,
  ConfirmationContextType,
} from "../hooks/confirmation"

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined)

interface ConfirmationProviderProps {
  children: ReactNode
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    visible: false,
    title: "",
    message: "",
    resolve: null,
    options: undefined,
  })

  const showConfirmation = (
    title: string,
    message: string,
    options?: ConfirmationOptions,
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setConfirmationState({
        visible: true,
        title,
        message,
        resolve,
        options,
      })
    })
  }

  const handleConfirm = () => {
    if (confirmationState.resolve) {
      confirmationState.resolve(true)
    }
    setConfirmationState({
      visible: false,
      title: "",
      message: "",
      resolve: null,
      options: undefined,
    })
  }

  const handleCancel = () => {
    if (confirmationState.resolve) {
      confirmationState.resolve(false)
    }
    setConfirmationState({
      visible: false,
      title: "",
      message: "",
      resolve: null,
      options: undefined,
    })
  }

  return (
    <ConfirmationContext.Provider value={{ showConfirmation }}>
      {children}
      <ConfirmationModal
        visible={confirmationState.visible}
        title={confirmationState.title}
        message={confirmationState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        options={confirmationState.options}
      />
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error("useConfirmation must be used within ConfirmationProvider")
  }
  return context
}
