import { TextStyle, ViewStyle } from "react-native"
// import * as Notifications from "expo-notifications"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Icon } from "@/components/Icon"
import { MasterDataProvider } from "@/context/MasterDataContext"
import { translate } from "@/i18n/translate"
// import { DemoDebugScreen } from "@/screens/DemoDebugScreen"
import { AboutOrgScreen } from "@/screens/EMS/AboutOrg"
import { EmsHomeScreen } from "@/screens/EMS/EmsHomeScreen"
import { ProfileScreen } from "@/screens/EMS/ProfileScreen"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type EmsTabParamList = {
  EmsHome: undefined
  AboutOrg: undefined
  DemoShowroom: undefined
  DemoDebug: undefined
  Profile: undefined
}

/*
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})
  */

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type EmsTabScreenProps<T extends keyof EmsTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<EmsTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<EmsTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `EmsNavigator`.
 */
export function EmsNavigator() {
  const { bottom } = useSafeAreaInsets()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  return (
    <MasterDataProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: themed([$tabBar, { height: bottom + 70 }]),
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.text,
          tabBarLabelStyle: themed($tabBarLabel),
          tabBarItemStyle: themed($tabBarItem),
        }}
      >
        <Tab.Screen
          name="EmsHome"
          component={EmsHomeScreen}
          options={{
            tabBarLabel: translate("emsNavigator:emsTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                icon="components"
                color={focused ? colors.tintEms : colors.tintEmsInactive}
                size={30}
              />
            ),
          }}
        />

        <Tab.Screen
          name="AboutOrg"
          component={AboutOrgScreen}
          options={{
            tabBarLabel: translate("emsNavigator:schoolTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                icon="school"
                color={focused ? colors.tintEms : colors.tintEmsInactive}
                size={30}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: translate("emsNavigator:profileTab"),
            tabBarIcon: ({ focused }) => (
              <Icon
                icon="community"
                color={focused ? colors.tintEms : colors.tintEmsInactive}
                size={30}
              />
            ),
          }}
        />

        {/*
        <Tab.Screen
          name="DemoDebug"
          component={DemoDebugScreen}
          options={{
            tabBarLabel: translate("demoNavigator:debugTab"),
            tabBarIcon: ({ focused }) => (
              <Icon icon="debug" color={focused ? colors.tint : colors.tintInactive} size={30} />
            ),
          }}
        />
        */}
      </Tab.Navigator>
    </MasterDataProvider>
  )
}

const $tabBar: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
})

const $tabBarItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
})

const $tabBarLabel: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.text,
})
