import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ContactInfoItem {
  icon: string
  label: string
  value: string
  action?: () => void
}

const ContactInfoCard: React.FC = () => {
  const handleEmailPress = () => {
    const email = "soporte@universidad.edu"
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert("Error", "No se pudo abrir la aplicación de correo")
    })
  }

  const handlePhonePress = () => {
    const phone = "1234567890"
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert("Error", "No se pudo realizar la llamada")
    })
  }

  const contactInfo: ContactInfoItem[] = [
    {
      icon: "mail",
      label: "Correo electrónico",
      value: "soporte@universidad.edu",
      action: handleEmailPress,
    },
    {
      icon: "call",
      label: "Teléfono",
      value: "(123) 456-7890",
      action: handlePhonePress,
    },
    {
      icon: "time",
      label: "Horario de atención",
      value: "Lunes a Viernes, 8:00 a 16:00",
    },
  ]

  return (
    <View style={styles.container}>
      {contactInfo.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.infoItem, index < contactInfo.length - 1 && styles.borderBottom]}
          onPress={item.action}
          disabled={!item.action}
          activeOpacity={item.action ? 0.7 : 1}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={item.icon as any} size={20} color="#2196F3" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={[styles.value, item.action && styles.clickableValue]}>{item.value}</Text>
          </View>
          {item.action && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  clickableValue: {
    color: "#2196F3",
  },
})

export default ContactInfoCard
