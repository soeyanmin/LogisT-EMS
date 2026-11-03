/* eslint-disable react-native/no-inline-styles */
// context/MessageContext.tsx
// eslint-disable-next-line no-restricted-imports
import React, { createContext, useContext, useState, useCallback } from "react"
import { View } from "react-native"

import Message, { MessageType } from "../components/Message"

interface MessageState {
  id: string
  type: MessageType
  title: string
  message?: string
  duration?: number
  position?: "top" | "bottom"
}

interface MessageContextType {
  showMessage: (message: Omit<MessageState, "id">) => void
  hideMessage: (id: string) => void
  hideAllMessages: () => void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider")
  }
  return context
}

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageState[]>([])

  const showMessage = useCallback((message: Omit<MessageState, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newMessage = { ...message, id }

    setMessages((prev) => [...prev, newMessage])

    // Auto hide if duration is provided
    if (message.duration && message.duration > 0) {
      setTimeout(() => {
        hideMessage(id)
      }, message.duration)
    }
  }, [])

  const hideMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }, [])

  const hideAllMessages = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <MessageContext.Provider value={{ showMessage, hideMessage, hideAllMessages }}>
      {children}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 9999 }}>
        {messages
          .filter((msg) => msg.position === "top" || !msg.position)
          .map((message) => (
            <Message
              key={message.id}
              type={message.type}
              title={message.title}
              message={message.message}
              onClose={() => hideMessage(message.id)}
              position={message.position}
            />
          ))}
      </View>
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
        {messages
          .filter((msg) => msg.position === "bottom")
          .map((message) => (
            <Message
              key={message.id}
              type={message.type}
              title={message.title}
              message={message.message}
              onClose={() => hideMessage(message.id)}
              position={message.position}
            />
          ))}
      </View>
    </MessageContext.Provider>
  )
}
