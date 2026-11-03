/* eslint-disable react-native/no-color-literals */
// components/ConfirmationModal.tsx
// eslint-disable-next-line no-restricted-imports
import React from "react"
import {
  Modal,
  View,
  // eslint-disable-next-line no-restricted-imports
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native"

import { ConfirmationOptions } from "../hooks/confirmation"

interface ConfirmationModalProps {
  visible: boolean
  title: string
  message: string
  onConfirm: (event: GestureResponderEvent) => void
  onCancel: (event: GestureResponderEvent) => void
  options?: ConfirmationOptions
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  options,
}) => {
  const {
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "default",
    confirmColor = "#007AFF",
    cancelColor = "#f0f0f0",
  } = options || {}

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return { backgroundColor: "#FF3B30" }
      case "warning":
        return { backgroundColor: "#FF9500" }
      default:
        return { backgroundColor: confirmColor }
    }
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: cancelColor }]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, getConfirmButtonStyle()]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    padding: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  message: {
    color: "#666",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 5,
    maxWidth: 400,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "100%",
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
})

export default ConfirmationModal
