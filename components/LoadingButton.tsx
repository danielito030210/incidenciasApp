import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface LoadingButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  icon?: string
  backgroundColor?: string
  textColor?: string
  style?: object
  keepTextWhileLoading?: boolean
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  backgroundColor = "#2196F3",
  textColor = "white",
  style,
  keepTextWhileLoading = false,
}) => {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isDisabled ? "#ccc" : backgroundColor }, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={textColor} style={styles.spinner} />
        ) : (
          icon && <Ionicons name={icon as any} size={20} color={textColor} style={styles.icon} />
        )}
        <Text style={[styles.text, { color: textColor }]}>
          {loading && !keepTextWhileLoading ? "Iniciando sesión..." : title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default LoadingButton
