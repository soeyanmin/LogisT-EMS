/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-imports */
// app/components/ChangePasswordModal.tsx
import React, { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native"

// import { colors, spacing } from "../theme"
import { colors } from "@/theme/colors"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

export interface ChangePasswordModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>
  isLoading?: boolean
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (props) => {
  const { visible, onClose, onSubmit, isLoading = false } = props
  const { themed, theme } = useAppTheme()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== "")
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await onSubmit(currentPassword, newPassword)
        resetForm()
      } catch (error) {
        // Error handling is done in the parent component
      }
    }
  }

  const resetForm = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setErrors({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={themed($overlay)}>
        <View style={themed($modalContainer)}>
          {/* Header */}
          <View style={themed($header)}>
            <Text style={themed($title)}>Change Password</Text>
            <TouchableOpacity onPress={handleClose} style={themed($closeButton)}>
              <Text style={themed($closeButtonText)}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={themed($form)}>
            {/* Current Password */}
            <View style={themed($inputContainer)}>
              <Text style={themed($label)}>Current Password</Text>
              <TextInput
                style={[themed($input), errors.currentPassword ? themed($inputError) : null]}
                placeholder="Enter current password"
                placeholderTextColor={colors.palette.neutral500}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.currentPassword ? (
                <Text style={themed($errorText)}>{errors.currentPassword}</Text>
              ) : null}
            </View>

            {/* New Password */}
            <View style={themed($inputContainer)}>
              <Text style={themed($label)}>New Password</Text>
              <TextInput
                style={[themed($input), errors.newPassword ? themed($inputError) : null]}
                placeholder="Enter new password"
                placeholderTextColor={colors.palette.neutral500}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.newPassword ? (
                <Text style={themed($errorText)}>{errors.newPassword}</Text>
              ) : null}
            </View>

            {/* Confirm Password */}
            <View style={themed($inputContainer)}>
              <Text style={themed($label)}>Confirm New Password</Text>
              <TextInput
                style={[themed($input), errors.confirmPassword ? themed($inputError) : null]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.palette.neutral500}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.confirmPassword ? (
                <Text style={themed($errorText)}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Buttons */}
            <View style={themed($buttonContainer)}>
              <TouchableOpacity
                style={[themed($button), themed($cancelButton)]}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={themed($cancelButtonText)}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  themed($button),
                  themed($submitButton),
                  isLoading ? themed($submitButtonDisabled) : null,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors.palette.neutral100} />
                ) : (
                  <Text style={themed($submitButtonText)}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Styles
const $overlay: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: spacing.md,
}

const $modalContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  width: "100%",
  maxWidth: 400,
  padding: spacing.lg,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
}

const $header: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.lg,
}

const $title: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: colors.palette.neutral800,
}

const $closeButton: ViewStyle = {
  padding: spacing.xs,
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: colors.palette.neutral300,
  alignItems: "center",
  justifyContent: "center",
}

const $closeButtonText: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: colors.palette.neutral800,
  lineHeight: 20,
}

const $form: ViewStyle = {
  gap: spacing.md,
}

const $inputContainer: ViewStyle = {
  gap: spacing.xs,
}

const $label: TextStyle = {
  fontSize: 14,
  fontWeight: "500",
  color: colors.palette.neutral800,
  marginBottom: spacing.xs,
}

const $input: ViewStyle & TextStyle = {
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 8,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  fontSize: 16,
  backgroundColor: colors.palette.neutral100,
  color: colors.palette.neutral800,
}

const $inputError: ViewStyle = {
  borderColor: colors.palette.angry500,
}

const $errorText: TextStyle = {
  color: colors.palette.angry500,
  fontSize: 12,
  marginTop: spacing.xs,
}

const $buttonContainer: ViewStyle = {
  flexDirection: "row",
  gap: spacing.md,
  marginTop: spacing.lg,
}

const $button: ViewStyle = {
  flex: 1,
  paddingVertical: spacing.md,
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",
}

const $cancelButton: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
}

const $submitButton: ViewStyle = {
  backgroundColor: colors.palette.neutral700,
}

const $submitButtonDisabled: ViewStyle = {
  backgroundColor: colors.palette.neutral400,
  opacity: 0.6,
}

const $cancelButtonText: TextStyle = {
  color: colors.palette.neutral800,
  fontSize: 16,
  fontWeight: "600",
}

const $submitButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "600",
}
