/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react"
import { useMMKVString, useMMKVObject } from "react-native-mmkv"

import { apiMaster } from "@/services/api-ems-masters"
import type { OrgProfile } from "@/services/api-ems-masters/types"

export type MasterDataContextType = {
  orgProfile?: OrgProfile
  setOrgProfile: (value?: OrgProfile) => void
  getOrgProfile: (authToken: string) => void
}

export const MasterDataContext = createContext<MasterDataContextType | null>(null)

export interface MasterDataProviderProps {}

export const MasterDataProvider: FC<PropsWithChildren<MasterDataProviderProps>> = ({ children }) => {
  const [orgProfile, setOrgProfile] = useMMKVObject<OrgProfile>("MasterDataProvider.orgProfile")

  const getOrgProfile = useCallback(async (authToken: string) => {
      
      const response = await apiMaster.getOrgProfile(authToken)
      if (response.kind === "ok") {
        // console.log(response)
        setOrgProfile(response.orgProfile)
      } else {
        console.error(`Error user login: ${JSON.stringify(response)}`)
      }
    }, [])

  const value = {
    orgProfile,
    setOrgProfile,
    getOrgProfile,
  }

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>
}

export const useMasterData = () => {
  const context = useContext(MasterDataContext)
  if (!context) throw new Error("useMasterData must be used within an MasterDataProvider")
  return context
}
