import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, required = false, children }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>
        {label} {required && "*"}
      </Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
})

export default FormField
