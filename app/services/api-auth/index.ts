/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import type { EpisodeItem } from "@/services/api/types"

import { ApiAuthDataResponse, AuthData, ChangePasswordResponse, Permission } from "./types"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import { DEFAULT_API_CONFIG } from "../api/index"
import type { ApiConfig, ApiFeedResponse } from "../api/types"

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class ApiAuth {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.ems_url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeItem[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our model.
      const episodes: EpisodeItem[] =
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * login to LogisT EMS
   */
  async postLogin(
    tenantName: string,
    userName: string,
    password: string,
    rememberMe: boolean,
  ): Promise<{ kind: "ok"; authInfo: AuthData } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiAuthDataResponse> = await this.apisauce.post(
      // `auth`, { tenantName: tenantName, userName: userName, password: password, rememberMe: rememberMe, returnUrl: "" }
      // tslint:disable-next-line: max-line-length
      `api/TokenAuth/TenantUserAuthenticate`,
      {
        userNameOrEmailAddress: userName,
        password: password,
        rememberClient: rememberMe,
        tenantName: tenantName,
      },
    )

    // console.log("postLogin response")
    // console.log(response)

    // the typical ways to die when calling an api
    if (!response.ok) {
      // tslint:disable-next-line: typedef
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data?.result

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const permissions: Permission[] =
        rawData?.externalPermissions?.map((raw) => ({
          ...raw,
        })) ?? []

      const authInfo: AuthData = {
        accessToken: rawData?.accessToken,
        encryptedAccessToken: rawData?.encryptedAccessToken,
        expireInSeconds: rawData?.expireInSeconds,
        userId: rawData?.userId,
        tenantId: rawData?.tenantId,
        isAdmin: rawData?.isAdmin,
        isTeacher: rawData?.isTeacher,
        isStudent: rawData?.isStudent,
        userName: rawData?.userName,
        tenantDisplayName: rawData?.tenantDisplayName,
        externalPermissions: permissions,
      }

      return { kind: "ok", authInfo }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }

  /**
   * Change Password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    authToken: string,
  ): Promise<{ kind: "ok"; result: ChangePasswordResponse } | GeneralApiProblem> {
    // make the api call
    this.apisauce.setHeaders({ Authorization: `Bearer ${authToken}` })
    const response: ApiResponse<ChangePasswordResponse> = await this.apisauce.post(
      // `auth`, { tenantName: tenantName, userName: userName, password: password, rememberMe: rememberMe, returnUrl: "" }
      // tslint:disable-next-line: max-line-length
      `api/services/app/User/ChangePassword`,
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    )

    console.log("change password response")
    console.log(response)

    // the typical ways to die when calling an api
    if (!response.ok) {
      // tslint:disable-next-line: typedef
      const problem = getGeneralApiProblem(response)
      if (problem) {
        return problem
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      const result: ChangePasswordResponse = {
        data: rawData,
        success: true,
        error: null,
      }

      // console.log("Change Password Result in Api")
      // console.log(result)

      return { kind: "ok", result }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const apiAuth = new ApiAuth()
