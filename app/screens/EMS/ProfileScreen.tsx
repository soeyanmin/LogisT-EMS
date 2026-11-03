/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import { FC, useEffect, useState } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle, Image, Alert } from "react-native"

// import ChangePasswordModal from "@/components/ChangePassword/ChangePasswordModal"
// eslint-disable-next-line import/no-unresolved
import { ChangePasswordModal } from "@/components/ChangePasswordModal"
import { Icon } from "@/components/Icon"
import { ListItem } from "@/components/ListItem"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { useConfirmation } from "@/context/ConfirmationContext"
import { isRTL } from "@/i18n"
import { EmsTabScreenProps } from "@/navigators/EmsNavigator"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"

import { useToast } from "../../hooks/useToast"
import { DemoDivider } from "../DemoShowroomScreen/DemoDivider"

const profileLogo = require("@assets/images/user.png")

export const ProfileScreen: FC<EmsTabScreenProps<"Profile">> = function ProfileScreen(_props) {
  const { themed, theme } = useAppTheme()
  const { logout, authData, authToken, changePassword, changePasswordResult } = useAuth()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /* useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    if (isLoading) {
      console.log("changePasswordResult")
      console.log(changePasswordResult)

      if (changePasswordResult) {
        handleChangePasswordSuccess()
        setIsLoading(false)
        logout()
      } else {
        handleChangePasswordError()
        setIsLoading(false)
      }
      setIsChangePasswordModalVisible(false)
    }
  }, [isLoading, changePasswordResult]) */

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)

    try {
      // Simulate API call - replace with your actual API call
      // await new Promise((resolve) => setTimeout(resolve, 2000))
      await changePassword(currentPassword, newPassword, authToken!)

      handleChangePasswordSuccess()
      logout()

      // Your actual API call would look something like:
      // const response = await authAPI.changePassword(currentPassword, newPassword)

      /* console.log("changePasswordResult")
      console.log(changePasswordResult)

      if (changePasswordResult) {
        handleChangePasswordSuccess()
        setIsLoading(false)
        logout()
      } else {
        handleChangePasswordError()
        setIsLoading(false)
      } */
      setIsChangePasswordModalVisible(false)
    } catch (error: any) {
      // Alert.alert("Error", error?.message || "Failed to change password. Please try again.")
      handleChangePasswordError()
      // console.error("Password change error:", error)
      // Re-throw the error so the modal can handle it if needed
      // throw error
    } finally {
      setIsLoading(false)
    }
  }

  const toast = useToast()
  const { showConfirmation } = useConfirmation()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangePasswordSuccess = () => {
    toast.showSuccess(
      "Success!",
      "Password changed successfully. Please re-login with new password.",
      6000,
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangePasswordError = () => {
    toast.showError("Error!", "Failed to change password. Please try again.")
  }

  const handleLogout = async (): Promise<void> => {
    const confirmed = await showConfirmation(
      "Logout",
      "Are you sure you want to logout? You will need to sign in again to access your account.",
    )

    if (confirmed) {
      console.log("Success", "Logged out successfully!")
      logout()
    }
  }

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={[$styles.container, themed($container)]}
    >
      <Text style={themed($title)} preset="heading" tx="profileScreen:title" />
      {userInfo()}

      <DemoDivider />

      {settingInfo()}

      <DemoDivider />
    </Screen>
  )

  function userInfo() {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => null} style={themed($userInfoWrapStyle)}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={profileLogo}
            style={{
              width: 70.0,
              height: 70.0,
              borderRadius: spacing.md - 5.0,
            }}
            resizeMode="cover"
          />
          <View style={themed($userInfoStyle)}>
            <Text style={themed($item)}>{authData?.userName}</Text>
            <Text style={themed($item)}>*****</Text>
          </View>
          <ChangePasswordModal
            visible={isChangePasswordModalVisible}
            onClose={() => setIsChangePasswordModalVisible(false)}
            onSubmit={handleChangePassword}
            isLoading={isLoading}
          />
        </View>
        <Icon icon="caretRight" color={theme.colors.tintEms} size={25} />
      </TouchableOpacity>
    )
  }

  function settingInfo() {
    return (
      <View style={themed($settingInfoWrapStyle)}>
        <ListItem
          tx="common:changePassword"
          rightIcon={isRTL ? "caretLeft" : "caretRight"}
          leftIcon="key"
          onPress={() => setIsChangePasswordModalVisible(true)}
        />
        <ListItem
          tx="common:logOut"
          rightIcon={isRTL ? "caretLeft" : "caretRight"}
          leftIcon="logout"
          onPress={handleLogout}
        />
      </View>
    )
  }
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $item: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $userInfoWrapStyle: ThemedStyle<ViewStyle> = ({ colors, isDark, spacing }) => ({
  marginBottom: spacing.xxxs,
  flexDirection: "row",
  marginHorizontal: spacing.xxxs,
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: !isDark ? "white" : colors.background,
  borderRadius: spacing.xs,
  padding: 10,
})

const $settingInfoWrapStyle: ThemedStyle<ViewStyle> = ({ colors, isDark, spacing }) => ({
  marginBottom: spacing.xxxs,
  flexDirection: "column",
  marginHorizontal: spacing.xxxs,
  backgroundColor: !isDark ? "white" : colors.background,
  borderRadius: spacing.xxs,
  padding: 10,
})

const $userInfoStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: 80.0,
  justifyContent: "space-between",
  paddingVertical: spacing.md + 4.0,
  marginLeft: spacing.md,
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $seperator: ThemedStyle<ViewStyle> = ({ colors, isDark, spacing }) => ({
  height: 1, // Or desired thickness
  width: "100%", // Or specific width
  backgroundColor: !isDark ? "#ccc" : colors.background, // Or desired color
  marginVertical: spacing.xs + 2, // Add vertical spacing if needed
})
