/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"

import { ApiMasterDataResponse, OrgProfile } from "./types"
import { GeneralApiProblem, getGeneralApiProblem } from "../api/apiProblem"
import { DEFAULT_API_CONFIG } from "../api/index"
import type { ApiConfig } from "../api/types"

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class ApiMaster {
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
   * Gets org profile.
   */
  async getOrgProfile(
    authToken: string,
  ): Promise<{ kind: "ok"; orgProfile: OrgProfile } | GeneralApiProblem> {
    this.apisauce.setHeaders({ Authorization: `Bearer ${authToken}` })

    // make the api call
    const response: ApiResponse<ApiMasterDataResponse> = await this.apisauce.get(
      `api/services/app/TenantOrg/Get?Id=00000000-0000-0000-0000-000000000000`,
    )

    // console.log("TenantOrg response")
    // console.log(response)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data?.result

      const orgProfile: OrgProfile = {
        id: rawData?.id,
        name: rawData?.name,
        description: rawData?.description,
        postalCode: rawData?.postalCode,
        address: rawData?.address,
        phoneNo: rawData?.phoneNo,
        email: rawData?.email,
        fax: rawData?.fax,
        logoPath: rawData?.logoPath,
        mapCenterLocation: rawData?.mapCenterLocation,
        facebookUrl: rawData?.facebookUrl,
        instagramUrl: rawData?.instagramUrl,
        xUrl: rawData?.xUrl,
        tiktokUrl: rawData?.tiktokUrl,
        aboutOrg: rawData?.aboutOrg,
      }
      return { kind: "ok", orgProfile }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const apiMaster = new ApiMaster()
