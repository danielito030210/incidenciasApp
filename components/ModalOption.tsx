import type React from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ModalOptionProps {
  onPress: () => void
  children: React.ReactNode
  isSelected?: boolean
  icon?: string
}

const ModalOption: React.FC<ModalOptionProps> = ({ onPress, children, isSelected = false, icon }) => {
  return (
    <TouchableOpacity style={styles.modalOption} onPress={onPress}>
      <View style={styles.optionContent}>
        {icon && <Ionicons name={icon as any} size={24} color="#666" style={styles.modalOptionIcon} />}
        {children}
      </View>
      {isSelected && <Ionicons name="checkmark" size={20} color="#2196F3" />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalOptionIcon: {
    marginRight: 12,
  },
})

export default ModalOption
