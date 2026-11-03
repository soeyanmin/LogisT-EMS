/* eslint-disable react-native/no-color-literals */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-imports */
import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native"

import { ChangePasswordModalProps, ChangePasswordForm } from "./types"
import { usePasswordValidation } from "./usePasswordValidation"

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ChangePasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<ChangePasswordForm>>({})

  const { validation: newPasswordValidation, isValid: isNewPasswordValid } = usePasswordValidation(
    form.newPassword,
  )

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordForm> = {}

    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!form.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (!isNewPasswordValid) {
      newErrors.newPassword = "Password does not meet requirements"
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSubmit(form)
      Alert.alert("Success", "Password changed successfully")
      handleClose()
    } catch (error) {
      Alert.alert("Error", "Failed to change password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setErrors({})
    onClose()
  }

  const updateField = (field: keyof ChangePasswordForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const ValidationItem: React.FC<{ isValid: boolean; text: string }> = ({ isValid, text }) => (
    <View style={styles.validationItem}>
      <View style={[styles.validationDot, isValid ? styles.validDot : styles.invalidDot]} />
      <Text style={[styles.validationText, isValid ? styles.validText : styles.invalidText]}>
        {text}
      </Text>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Change Password</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={[styles.input, errors.currentPassword && styles.inputError]}
              placeholder="Enter current password"
              secureTextEntry
              value={form.currentPassword}
              onChangeText={(value) => updateField("currentPassword", value)}
              editable={!loading}
            />
            {errors.currentPassword && (
              <Text style={styles.errorText}>{errors.currentPassword}</Text>
            )}
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={[styles.input, errors.newPassword && styles.inputError]}
              placeholder="Enter new password"
              secureTextEntry
              value={form.newPassword}
              onChangeText={(value) => updateField("newPassword", value)}
              editable={!loading}
            />
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

            {/* Password Requirements */}
            {form.newPassword.length > 0 && (
              <View style={styles.validationContainer}>
                <Text style={styles.validationTitle}>Password must contain:</Text>
                <ValidationItem
                  isValid={newPasswordValidation.hasMinLength}
                  text="At least 8 characters"
                />
                <ValidationItem
                  isValid={newPasswordValidation.hasUpperCase}
                  text="One uppercase letter"
                />
                <ValidationItem
                  isValid={newPasswordValidation.hasLowerCase}
                  text="One lowercase letter"
                />
                <ValidationItem isValid={newPasswordValidation.hasNumber} text="One number" />
                <ValidationItem
                  isValid={newPasswordValidation.hasSpecialChar}
                  text="One special character"
                />
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Confirm new password"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(value) => updateField("confirmPassword", value)}
              editable={!loading}
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (!isNewPasswordValid || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isNewPasswordValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Change Password</Text>
            )}
          </TouchableOpacity>
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
    padding: 16,
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: "#666666",
    fontSize: 18,
  },
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    borderTopColor: "#E5E5E5",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  header: {
    alignItems: "center",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DDDDDD",
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    padding: 12,
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  inputGroup: {
    marginBottom: 24,
  },
  invalidDot: {
    backgroundColor: "#FF3B30",
  },
  invalidText: {
    color: "#FF3B30",
  },
  label: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
  },
  validDot: {
    backgroundColor: "#34C759",
  },
  validText: {
    color: "#34C759",
  },
  validationContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginTop: 12,
    padding: 12,
  },
  validationDot: {
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  validationItem: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 4,
  },
  validationText: {
    fontSize: 12,
  },
  validationTitle: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
})

export default ChangePasswordModal
