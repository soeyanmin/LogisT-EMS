import { Linking, Platform } from "react-native"

/**
 * Helper for opening a give URL in an external browser.
 */
export async function openLinkInPhoneCallApp(number: string) {
  // Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url))
  const phoneNumber = `${Platform.OS !== "android" ? "telprompt" : "tel"}:${number}`

  try {
    const supported = await Linking.canOpenURL(phoneNumber)
    if (supported) {
      Linking.openURL(phoneNumber)
    } else {
      // Handle cases where the phone call cannot be made (e.g., no phone app)
      console.log("Phone call not supported on this device.")
    }
  } catch (error) {
    console.error("Error opening phone call:", error)
  }
}

export async function openLinkInApp(url: string) {
  try {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      console.log("Don't know how to open this URL: " + url)
    }
  } catch (error) {
    console.error("An error occurred", error)
  }
}
