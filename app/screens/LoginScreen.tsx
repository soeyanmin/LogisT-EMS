/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { ActivityIndicator, Image, ImageStyle, TextInput, TextStyle, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { useNotification } from "@/context/NotificationContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { useToast } from "../hooks/useToast"

const loginLogo = require("@assets/images/login-icon.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const authPasswordInput = useRef<TextInput>(null)

  // const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { notification, expoPushToken, error } = useNotification()
  const toast = useToast()

  const {
    authEmail,
    authOrg,
    authPassword,
    setAuthEmail,
    setAuthToken,
    setAuthOrg,
    setAuthPassword,
    postLogin,
    validationError,
    validationError_SchoolName,
    validationError_Password,
  } = useAuth()

  const {
    themed,
    theme: { colors },
    setThemeContextOverride,
    themeContext,
  } = useAppTheme()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    /*
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")
    */
    setAuthEmail("")
    setAuthPassword("")
    // setAuthOrg("nyein")
    setThemeContextOverride("light")

    if (error) {
      console.log("Notification Error Message!")
      console.log(error.message)
    } else {
      console.log("expoPushToken")
      console.log(expoPushToken)
      console.log("Notification Message!")
      console.log(JSON.stringify(notification?.request.content.data, null, 2))
    }
  }, [setAuthEmail, setAuthPassword])

  const error_validation = isSubmitted ? validationError : ""
  const errorSchoolName = isSubmitted ? validationError_SchoolName : ""
  const errorPassword = isSubmitted ? validationError_Password : ""

  async function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError || validationError_SchoolName || validationError_Password) {
      return
    }

    setIsLoggingIn(true)
    try {
      await postLogin(authOrg!, authEmail!, authPassword!)
    } catch (error: any) {
      toast.showError("Error!", "Invalid User Name or Password. Please try again.")
    }

    setIsLoggingIn(false)

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")

    // We'll mock this with a fake token.
    // setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Image style={themed($loginLogo)} source={loginLogo} resizeMode="contain" />

      {/*
      <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={themed($logIn)} />
      <Text tx="loginScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />
      {attemptsCount > 2 && (
        <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
      )} */}

      {isLoggingIn ? <ActivityIndicator /> : null}

      <TextField
        value={authOrg}
        onChangeText={setAuthOrg}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        keyboardType="default"
        labelTx="loginScreen:orgName"
        placeholderTx="loginScreen:orgNameFieldPlaceholder"
        helper={errorSchoolName}
        status={errorSchoolName ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="name"
        autoCorrect={false}
        // keyboardType="email-address"
        keyboardType="default"
        labelTx="loginScreen:userIdFieldLabel"
        placeholderTx="loginScreen:userIdFieldPlaceholder"
        helper={error_validation}
        status={error_validation ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen:passwordFieldLabel"
        placeholderTx="loginScreen:passwordFieldPlaceholder"
        helper={errorPassword}
        status={errorPassword ? "error" : undefined}
        onSubmitEditing={login}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx="loginScreen:tapToLogIn"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const $loginLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})
