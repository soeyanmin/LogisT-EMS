/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface AuthData {
  accessToken?: string
  encryptedAccessToken?: string
  expireInSeconds?: number
  userId?: number
  tenantId?: number
  isAdmin?: boolean
  isTeacher?: boolean
  isStudent?: boolean
  userName?: string
  tenantDisplayName?: string
  externalPermissions?: Permission[]
}

export interface Permission {
  name?: string
  isAuthorize: false
}

export interface ApiAuthDataResponse {
  result: AuthData
  success: true
  error: null
}

export interface ChangePasswordResponse {
  data: any
  success: true
  error: null
}
