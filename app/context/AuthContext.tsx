/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"
import { useMMKVString, useMMKVObject } from "react-native-mmkv"

// eslint-disable-next-line import/namespace
import { apiAuth } from "@/services/api-auth"
import type { AuthData, ChangePasswordResponse } from "@/services/api-auth/types"

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  authEmail?: string
  authOrg?: string
  authPassword?: string
  authData?: AuthData
  changePasswordResult: boolean
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  setAuthOrg: (org: string) => void
  setAuthPassword: (org: string) => void
  setAuthData: (value?: AuthData) => void
  setChangePasswordResult: (value: boolean) => void
  postLogin: (orgName: string, userId: string, password: string) => void
  logout: () => void
  changePassword: (currentPassword: string, newPassword: string, accessToken: string) => void
  validationError: string
  validationError_SchoolName: string
  validationError_Password: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [authOrg, setAuthOrg] = useMMKVString("AuthProvider.authOrg")
  const [authData, setAuthData] = useMMKVObject<AuthData>("AuthProvider.authData")
  const [authPassword, setAuthPassword] = useState("")
  const [changePasswordResult, setChangePasswordResult] = useState<boolean>(false)
  
  const [credentialError, setCredentialError] = useState("")

  const postLogin = useCallback(async (orgName: string, userId: string, password: string) => {
      
      const response = await apiAuth.postLogin(orgName, userId, password, true)
      if (response.kind === "ok") {
        // console.log(response)
        setAuthData(response.authInfo)
        setAuthToken(response.authInfo.accessToken)
      } else {
        setCredentialError(response.kind)
        throw Error()
        console.error(`Error user login: ${JSON.stringify(response)}`)
      }
    }, [])

  const logout = useCallback(() => {
    setAuthToken(undefined)
    setAuthEmail("")
  }, [setAuthEmail, setAuthToken])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string, accessToken: string) => {

    // console.log('changePassword token')
    // console.log(authToken)
      
    const response = await apiAuth.changePassword(currentPassword, newPassword, accessToken)
    console.log("change password response AuthContext")
    console.log(response)
    /* await new Promise((resolve) => setTimeout(resolve, 2000))
    const response: any = {
      kind: "ok",
    } */

    if (response.kind === "ok") {
      setChangePasswordResult(true)
      console.log("inside context response ok: changePasswordResult")
      console.log(changePasswordResult)
    } else {
      setChangePasswordResult(false)
      throw Error("Invalid Password!")
      // console.error(`Error user login: ${JSON.stringify(response)}`)
    }
  }, [])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "User name can't be blank"
    if (authEmail.length < 5) return "must be at least 5 characters"
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const validationError_SchoolName = useMemo(() => {
    if (!authOrg || authOrg.length === 0) return "School name can't be blank"
    return ""
  }, [authOrg])

  const validationError_Password = useMemo(() => {
    if (!authPassword || authPassword.length === 0) return "Password can't be blank"
    return ""
  }, [authPassword])

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    authEmail,
    authOrg,
    authPassword,
    authData,
    changePasswordResult,
    setAuthToken,
    setAuthEmail,
    setAuthOrg,
    setAuthPassword,
    setAuthData,
    setChangePasswordResult,
    postLogin,
    logout,
    changePassword,
    validationError,
    validationError_SchoolName,
    validationError_Password,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
