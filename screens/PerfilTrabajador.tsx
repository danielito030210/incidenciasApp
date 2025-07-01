"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity, Alert, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useNavigation } from "../context/NavigationContext"

// Importar componentes reutilizables
import InputField from "../components/InputField"
import LoadingButton from "../components/LoadingButton"
import SectionHeader from "../components/SectionHeader"

interface PerfilData {
  foto: string | null
  nombreCompleto: string
  correoInstitucional: string
  telefono: string
}

interface CambioPassword {
  passwordActual: string
  passwordNuevo: string
  confirmarPassword: string
}

const PerfilTrabajador: React.FC = () => {
  const { user, logout } = useAuth()
  const { navigate, currentScreen } = useNavigation()

  // Debug
  useEffect(() => {
    console.log("PerfilTrabajador montado")
    console.log("Current screen en PerfilTrabajador:", currentScreen)
  }, [currentScreen])

  // Estado del perfil
  const [perfilData, setPerfilData] = useState<PerfilData>({
    foto: null,
    nombreCompleto: user?.nombre || "Juan Pérez González",
    correoInstitucional: user?.email || "juan.perez@empresa.com",
    telefono: "+57 300 123 4567",
  })

  // Estado del cambio de contraseña
  const [passwordData, setPasswordData] = useState<CambioPassword>({
    passwordActual: "",
    passwordNuevo: "",
    confirmarPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false,
  })

  const handleInputChange = (field: keyof PerfilData, value: string) => {
    setPerfilData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePasswordChange = (field: keyof CambioPassword, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const togglePasswordVisibility = (field: "actual" | "nuevo" | "confirmar") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const cambiarFotoPerfil = () => {
    Alert.alert("Cambiar Foto de Perfil", "Selecciona una opción:", [
      {
        text: "Cámara",
        onPress: () => {
          // Simular toma de foto
          Alert.alert("Cámara", "Funcionalidad de cámara simulada", [
            { text: "Cancelar" },
            {
              text: "Simular foto",
              onPress: () => {
                setPerfilData((prev) => ({
                  ...prev,
                  foto: "https://via.placeholder.com/150x150/2196F3/ffffff?text=JP",
                }))
                Alert.alert("Éxito", "Foto de perfil actualizada")
              },
            },
          ])
        },
      },
      {
        text: "Galería",
        onPress: () => {
          // Simular selección de galería
          Alert.alert("Galería", "Funcionalidad de galería simulada", [
            { text: "Cancelar" },
            {
              text: "Simular selección",
              onPress: () => {
                setPerfilData((prev) => ({
                  ...prev,
                  foto: "https://via.placeholder.com/150x150/4CAF50/ffffff?text=JP",
                }))
                Alert.alert("Éxito", "Foto de perfil actualizada")
              },
            },
          ])
        },
      },
      { text: "Cancelar", style: "cancel" },
    ])
  }

  const validarDatos = (): boolean => {
    if (!perfilData.nombreCompleto.trim()) {
      Alert.alert("Error", "El nombre completo es requerido")
      return false
    }
    if (!perfilData.correoInstitucional.trim()) {
      Alert.alert("Error", "El correo institucional es requerido")
      return false
    }
    if (!perfilData.telefono.trim()) {
      Alert.alert("Error", "El teléfono de contacto es requerido")
      return false
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(perfilData.correoInstitucional)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido")
      return false
    }

    return true
  }

  const validarCambioPassword = (): boolean => {
    if (!passwordData.passwordActual.trim()) {
      Alert.alert("Error", "Ingresa tu contraseña actual")
      return false
    }
    if (!passwordData.passwordNuevo.trim()) {
      Alert.alert("Error", "Ingresa la nueva contraseña")
      return false
    }
    if (passwordData.passwordNuevo.length < 6) {
      Alert.alert("Error", "La nueva contraseña debe tener al menos 6 caracteres")
      return false
    }
    if (passwordData.passwordNuevo !== passwordData.confirmarPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return false
    }
    if (passwordData.passwordActual === passwordData.passwordNuevo) {
      Alert.alert("Error", "La nueva contraseña debe ser diferente a la actual")
      return false
    }
    return true
  }

  const cambiarPassword = async () => {
    if (!validarCambioPassword()) return

    setLoading(true)
    try {
      // Simular cambio de contraseña
      await new Promise((resolve) => setTimeout(resolve, 2000))

      Alert.alert("Éxito", "Contraseña cambiada exitosamente", [
        {
          text: "OK",
          onPress: () => {
            setPasswordData({
              passwordActual: "",
              passwordNuevo: "",
              confirmarPassword: "",
            })
          },
        },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudo cambiar la contraseña. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const guardarCambios = async () => {
    if (!validarDatos()) return

    setLoading(true)
    try {
      // Simular guardado de cambios
      await new Promise((resolve) => setTimeout(resolve, 1500))
      Alert.alert("Éxito", "Información actualizada correctamente")
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios")
    } finally {
      setLoading(false)
    }
  }

  const cerrarSesion = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => {
          logout()
          navigate("Login")
        },
      },
    ])
  }

  const volverAlDashboard = () => {
    console.log("Volviendo al Dashboard")
    navigate("Dashboard")
  }

  console.log("Renderizando PerfilTrabajador")

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={volverAlDashboard}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Foto de Perfil */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {perfilData.foto ? (
              <Image source={{ uri: perfilData.foto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.defaultPhoto}>
                <Ionicons name="person" size={60} color="#666" />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={cambiarFotoPerfil}>
            <Ionicons name="camera" size={16} color="#2196F3" />
            <Text style={styles.changePhotoText}>Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Información Personal */}
        <View style={styles.section}>
          <SectionHeader title="Información Personal" subtitle="Edita tus datos personales" />

          <InputField
            label="Nombre Completo"
            icon="person"
            value={perfilData.nombreCompleto}
            onChangeText={(value) => handleInputChange("nombreCompleto", value)}
            placeholder="Ingresa tu nombre completo"
            containerStyle={styles.fieldContainer}
          />

          <InputField
            label="Correo Institucional"
            icon="mail"
            value={perfilData.correoInstitucional}
            onChangeText={(value) => handleInputChange("correoInstitucional", value)}
            placeholder="Ingresa tu correo institucional"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.fieldContainer}
          />

          <InputField
            label="Teléfono de Contacto"
            icon="call"
            value={perfilData.telefono}
            onChangeText={(value) => handleInputChange("telefono", value)}
            placeholder="Ingresa tu teléfono"
            keyboardType="phone-pad"
            containerStyle={styles.fieldContainer}
          />
        </View>

        {/* Seguridad */}
        <View style={styles.section}>
          <SectionHeader title="Seguridad" subtitle="Cambio de contraseña" />

          <InputField
            label="Contraseña Actual"
            icon="lock-closed"
            value={passwordData.passwordActual}
            onChangeText={(value) => handlePasswordChange("passwordActual", value)}
            placeholder="Ingresa tu contraseña actual"
            secureTextEntry={!showPasswords.actual}
            containerStyle={styles.fieldContainer}
            rightIcon={
              <TouchableOpacity onPress={() => togglePasswordVisibility("actual")}>
                <Ionicons name={showPasswords.actual ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Nueva Contraseña"
            icon="lock-closed"
            value={passwordData.passwordNuevo}
            onChangeText={(value) => handlePasswordChange("passwordNuevo", value)}
            placeholder="Ingresa la nueva contraseña"
            secureTextEntry={!showPasswords.nuevo}
            containerStyle={styles.fieldContainer}
            rightIcon={
              <TouchableOpacity onPress={() => togglePasswordVisibility("nuevo")}>
                <Ionicons name={showPasswords.nuevo ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Confirmar Nueva Contraseña"
            icon="lock-closed"
            value={passwordData.confirmarPassword}
            onChangeText={(value) => handlePasswordChange("confirmarPassword", value)}
            placeholder="Confirma la nueva contraseña"
            secureTextEntry={!showPasswords.confirmar}
            containerStyle={styles.fieldContainer}
            rightIcon={
              <TouchableOpacity onPress={() => togglePasswordVisibility("confirmar")}>
                <Ionicons name={showPasswords.confirmar ? "eye-off" : "eye"} size={20} color="#666" />
              </TouchableOpacity>
            }
          />

          <LoadingButton
            title="Cambiar Contraseña"
            onPress={cambiarPassword}
            loading={loading}
            icon="key"
            backgroundColor="#FF9800"
            style={styles.passwordButton}
            keepTextWhileLoading={true}
          />
        </View>

        {/* Botones de Acción */}
        <View style={styles.actionsSection}>
          <LoadingButton
            title="Guardar Cambios"
            onPress={guardarCambios}
            loading={loading}
            icon="save"
            backgroundColor="#4CAF50"
            keepTextWhileLoading={true}
          />

          <LoadingButton
            title="Cerrar Sesión"
            onPress={cerrarSesion}
            icon="log-out"
            backgroundColor="#F44336"
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoContainer: {
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#2196F3",
  },
  defaultPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#2196F3",
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  changePhotoText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
    marginLeft: 6,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  actionsSection: {
    marginTop: 10,
  },
  passwordButton: {
    marginTop: 16,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default PerfilTrabajador
