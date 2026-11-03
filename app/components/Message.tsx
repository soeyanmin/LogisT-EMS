/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-restricted-imports */
import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { width } = Dimensions.get("window")

export type MessageType = "success" | "error" | "warning" | "info"

interface MessageProps {
  type: MessageType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  showIcon?: boolean
  position?: "top" | "bottom"
}

const Message: React.FC<MessageProps> = ({
  type,
  title,
  message,
  onClose,
  showIcon = true,
  position = "top",
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }, [])

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50"
      case "error":
        return "#F44336"
      case "warning":
        return "#FF9800"
      case "info":
        return "#2196F3"
      default:
        return "#2196F3"
    }
  }

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle"
      case "error":
        return "close-circle"
      case "warning":
        return "warning"
      case "info":
        return "information-circle"
      default:
        return "information-circle"
    }
  }

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: position === "top" ? -100 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose?.()
    })
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
          [position]: 0,
        },
      ]}
    >
      <View style={styles.content}>
        {showIcon && <Ionicons name={getIconName()} size={24} color="white" style={styles.icon} />}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  container: {
    borderRadius: 8,
    elevation: 4,
    left: 0,
    marginHorizontal: 16,
    marginTop: 50,
    position: "absolute",
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    padding: 16,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
})

export default Message
