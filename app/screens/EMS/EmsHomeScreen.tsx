/* eslint-disable react-native/no-inline-styles */
import { FC, useState } from "react"
import { View } from "react-native"
import { StatusBar } from "expo-status-bar"
import { WebView } from "react-native-webview"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Screen } from "@/components/Screen"
import { useAuth } from "@/context/AuthContext"
import { EmsTabScreenProps } from "@/navigators/EmsNavigator"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { colors } from "@/theme/colors"

export const EmsHomeScreen: FC<EmsTabScreenProps<"EmsHome">> = function EmsHomeScreen(_props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { themed } = useAppTheme()

  const { authData } = useAuth()
  const [shouldReload, setShouldReload] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const customHTML = `
      <body style="display:flex; flex-direction: column;justify-content: center; 
        align-items:center; background-whitesmoke: black; color:black; height: 100%;">
          <h1 style="font-size:100px; padding: 50px; text-align: center;" 
          id="h1_element">
            This is simple html
          </h1>
          <h2 style="display: block; font-size:80px; padding: 50px; 
          text-align: center;" id="h2_element">
            This text will be changed later!
          </h2>
       </body>`

  const encodeAuthInfo = encodeURIComponent(
    JSON.stringify({
      accessToken: authData?.accessToken,
      userName: authData?.userName,
      userId: authData?.userId,
      tenantId: authData?.tenantId,
    }),
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const webViewSource = {
    uri:
      "https://poppensolutions.com/sms/account/login?contextSwitchToken=" +
      encodeAuthInfo +
      "&v=" +
      Date.now(), // Replace with your external URL
    headers: {
      Authorization: `Bearer ${authData?.accessToken}`, // Or whatever header format your API expects
      // "Content-Type": "application/json", // Example of another header
    },
  }

  return (
    // eslint-disable-next-line react-native/no-color-literals
    <View style={{ flex: 1 }}>
      <StatusBar
        animated={true} // Optional: Animate transitions
        style="dark"
        hidden={false} // Optional: Hide or show the status bar
      />
      <WebView
        source={webViewSource}
        onLoad={() => setShouldReload(true)}
        onShouldStartLoadWithRequest={() => shouldReload}
        startInLoadingState={false}
        cacheEnabled={false}
        onLoadProgress={({ nativeEvent }) => console.log("Loading progress:", nativeEvent.progress)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent
          console.warn("WebView error: ", nativeEvent)
        }}
        style={{ flex: 1, marginTop: 45 }}
      />
    </View>
  )
}
