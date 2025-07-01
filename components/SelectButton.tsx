import type React from "react"
import { TouchableOpacity, Text, View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SelectButtonProps {
  onPress: () => void
  placeholder: string
  value?: string
  showIndicator?: boolean
  indicatorColor?: string
}

const SelectButton: React.FC<SelectButtonProps> = ({
  onPress,
  placeholder,
  value,
  showIndicator = false,
  indicatorColor = "#666",
}) => {
  return (
    <TouchableOpacity style={styles.selectButton} onPress={onPress}>
      <View style={styles.contentContainer}>
        {showIndicator && <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />}
        <Text style={[styles.selectText, !value && styles.placeholder]}>{value || placeholder}</Text>
      </View>
      <Ionicons name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  selectButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
})

export default SelectButton
