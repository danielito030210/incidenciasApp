import type React from "react"
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface WelcomeHeaderProps {
  userName: string
  onLogout?: () => void
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, onLogout }) => {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  return (
    <View style={styles.header}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{getCurrentGreeting()}</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <TouchableOpacity style={styles.avatarContainer} onPress={onLogout}>
        <Ionicons name="log-out" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2196F3",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default WelcomeHeader
