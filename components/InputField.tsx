import type React from "react"
import { View, TextInput, Text, StyleSheet, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface InputFieldProps extends TextInputProps {
  label: string
  icon: string
  error?: string
  containerStyle?: object
  rightIcon?: React.ReactNode
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  containerStyle,
  rightIcon,
  editable = true,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError, !editable && styles.inputDisabled]}>
        <Ionicons name={icon as any} size={20} color={error ? "#F44336" : "#666"} style={styles.icon} />
        {editable ? (
          <TextInput style={styles.input} placeholderTextColor="#999" editable={editable} {...textInputProps} />
        ) : (
          <Text style={styles.readOnlyText}>{textInputProps.value}</Text>
        )}
        {rightIcon}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: "#F44336",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: 6,
    marginLeft: 4,
  },
})

export default InputField
