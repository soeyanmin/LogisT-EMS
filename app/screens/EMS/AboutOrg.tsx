/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react"
import { ActivityIndicator, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AutoImage } from "@/components/AutoImage"
import { ListItem } from "@/components/ListItem"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
// eslint-disable-next-line import/namespace
import { useMasterData } from "@/context/MasterDataContext"
import { isRTL } from "@/i18n"
import { EmsTabScreenProps } from "@/navigators/EmsNavigator"
import { DEFAULT_API_CONFIG } from "@/services/api"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { openLinkInPhoneCallApp, openLinkInApp } from "@/utils/openLinkInApp"

export const AboutOrgScreen: FC<EmsTabScreenProps<"AboutOrg">> = function AboutOrgScreen(_props) {
  const { themed } = useAppTheme()

  const { authToken, authData } = useAuth()
  const { orgProfile, getOrgProfile } = useMasterData()

  const [isLoading, setIsLoading] = useState(false)

  const [logoImageSource, setLogoImageSource] = useState("")

  // initially, kick off a background refresh without the refreshing UI
  useEffect(() => {
    ;(async function load() {
      setIsLoading(true)
      await getOrgProfile(authToken!)
      // console.log("orgProfile")
      // console.log(orgProfile)
      // console.log("logoImageSource")
      if (orgProfile?.id !== null) {
        setLogoImageSource(
          DEFAULT_API_CONFIG.ems_url +
            "api/file/GetImageBySourceIdAndName?sourceId=" +
            orgProfile?.id +
            // eslint-disable-next-line prettier/prettier
            "&name=OrganizationProfile-Logo&_tenantId=" + authData?.tenantId
        )
      }
      // console.log(logoImageSource)
      // console.log(authData)
      setIsLoading(false)
    })()
  }, [getOrgProfile])

  return (
    <Screen preset="scroll" contentContainerStyle={$styles.container} safeAreaEdges={["top"]}>
      {isLoading ? <ActivityIndicator /> : null}
      {logoImageSource !== undefined ? (
        <View style={[$styles.row, themed($logoOrgContainer)]}>
          <Image
            source={{
              uri:
                DEFAULT_API_CONFIG.ems_url +
                "api/file/GetImageBySourceIdAndName?sourceId=" +
                orgProfile?.id +
                // eslint-disable-next-line prettier/prettier
              "&name=OrganizationProfile-Logo&_tenantId=" + authData?.tenantId + "&v=" + Date.now(),
            }}
            style={$logoOrg}
            onError={(error) => console.log("Image loading error:", error.nativeEvent.error)}
          />
        </View>
      ) : (
        <></>
      )}
      <View style={[$styles.row, themed($titleCenter)]}>
        <Text preset="subheading" text={orgProfile?.name} style={themed($title)} />
      </View>
      <Text text={orgProfile?.aboutOrg} style={themed($tagline)} />

      <Text preset="subheading" text="Address" style={themed($title)} />
      <Text text={orgProfile?.address} style={themed($description)} />

      <Text preset="subheading" tx="common:contact" style={themed($sectionTitle)} />
      <ListItem
        text={orgProfile?.email}
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        leftIcon="email"
        onPress={() =>
          openLinkInApp(orgProfile?.email !== undefined ? "mailto:" + orgProfile.email : "")
        }
      />
      <ListItem
        text={orgProfile?.phoneNo}
        leftIcon="call"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() =>
          openLinkInPhoneCallApp(orgProfile?.phoneNo !== undefined ? orgProfile.phoneNo : "")
        }
      />
      <ListItem
        text={orgProfile?.fax}
        leftIcon="fax"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => null}
      />
      <ListItem
        text="Map"
        leftIcon="map"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() =>
          openLinkInApp(
            orgProfile?.mapCenterLocation !== undefined ? orgProfile.mapCenterLocation : "",
          )
        }
      />
    </Screen>
  )
}

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $titleCenter: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  display: "flex",
  justifyContent: "center",
})

const $tagline: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $description: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.xxl,
})

const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.md,
  flexWrap: "wrap",
  alignContent: "center",
  alignSelf: "stretch",
})

const $logo: ImageStyle = {
  height: 38,
  width: 38,
}

const $logoOrgContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginEnd: spacing.md,
  paddingBottom: 20,
  display: "flex",
  justifyContent: "center",
})

const $logoOrg: ImageStyle = {
  height: 120,
  width: 120,
}
