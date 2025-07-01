import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SystemStatusBannerProps {
  status?: "operational" | "maintenance" | "issues"
  message?: string
}

const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({
  status = "operational",
  message = "Todos los sistemas funcionan con normalidad.",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "maintenance":
        return {
          icon: "construct",
          color: "#FF9800",
          backgroundColor: "#FFF3E0",
          borderColor: "#FF9800",
        }
      case "issues":
        return {
          icon: "warning",
          color: "#F44336",
          backgroundColor: "#FFEBEE",
          borderColor: "#F44336",
        }
      default:
        return {
          icon: "checkmark-circle",
          color: "#4CAF50",
          backgroundColor: "#E8F5E8",
          borderColor: "#4CAF50",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor, borderColor: config.borderColor }]}>
      <Ionicons name={config.icon as any} size={20} color={config.color} style={styles.icon} />
      <Text style={[styles.message, { color: config.color }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
})

export default SystemStatusBanner
