/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface OrgProfile {
  id?: string
  name?: string
  description?: string
  postalCode?: string
  address?: string
  phoneNo?: string
  email?: string
  fax?: string
  logoPath?: string
  mapCenterLocation?: string
  facebookUrl?: string
  instagramUrl?: string
  xUrl?: string
  tiktokUrl?: string
  aboutOrg?: string
}

export interface ApiMasterDataResponse {
  result: any
  success: true
  error: null
}
