"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Componentes
import Logo from "../components/Logo"
import InputField from "../components/InputField"
import LoadingButton from "../components/LoadingButton"
import { useAuth } from "../context/AuthContext"

interface LoginProps {
  onLogin: (usuario: string, contraseña: string, tipoUsuario: "trabajador" | "administrador") => void
  onForgotPassword: () => void
}

interface FormErrors {
  usuario?: string
  contraseña?: string
  general?: string
}

const Login: React.FC<LoginProps> = ({ onLogin, onForgotPassword }) => {
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es requerido"
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres"
    }

    if (!formData.contraseña.trim()) {
      newErrors.contraseña = "La contraseña es requerida"
    } else if (formData.contraseña.length < 4) {
      newErrors.contraseña = "La contraseña debe tener al menos 4 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    setErrors({})

    try {
      // TODO: Determinar tipo de usuario desde respuesta del servidor
      // Por ahora, determinamos el tipo basado en credenciales
      // En producción, esto debe venir del backend
      let tipoUsuario: "trabajador" | "administrador" = "trabajador"

      // TEMPORAL: Lógica para determinar tipo hasta conectar API
      if (formData.usuario === "admin" || formData.usuario.includes("admin")) {
        tipoUsuario = "administrador"
      }

      await login(formData.usuario.trim(), formData.contraseña.trim(), tipoUsuario)
      onLogin(formData.usuario.trim(), formData.contraseña.trim(), tipoUsuario)
    } catch (error: any) {
      setErrors({
        general: error.message || "Usuario o contraseña incorrectos",
      })
    }
  }

  const handleForgotPassword = () => {
    Alert.alert(
      "Recuperar Contraseña",
      "¿Deseas recuperar tu contraseña? Se enviará un enlace a tu correo electrónico.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: () => {
            // TODO: Implementar recuperación de contraseña
            // Ejemplo: await fetch('/api/auth/forgot-password', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ email: userEmail })
            // })
            onForgotPassword()
          },
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <Logo />

        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <Text style={styles.subtitleText}>Inicia sesión para continuar</Text>

          {/* Error general */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#F44336" />
              <Text style={styles.errorGeneralText}>{errors.general}</Text>
            </View>
          )}

          {/* Campo Usuario */}
          <InputField
            label="Usuario"
            icon="person"
            placeholder="Ingresa tu usuario"
            value={formData.usuario}
            onChangeText={(value) => handleInputChange("usuario", value)}
            error={errors.usuario}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Campo Contraseña */}
          <View style={styles.passwordContainer}>
            <InputField
              label="Contraseña"
              icon="lock-closed"
              placeholder="Ingresa tu contraseña"
              value={formData.contraseña}
              onChangeText={(value) => handleInputChange("contraseña", value)}
              error={errors.contraseña}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Botón de Login */}
          <LoadingButton
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
            icon="log-in"
            style={styles.loginButton}
          />

          {/* Olvidaste contraseña */}
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* TODO: Eliminar credenciales de prueba en producción */}
        <View style={styles.testCredentials}>
          <Text style={styles.testTitle}>Credenciales de prueba (ELIMINAR EN PRODUCCIÓN):</Text>
          <Text style={styles.testText}>👷 Trabajador: trabajador / 1234</Text>
          <Text style={styles.testText}>👑 Administrador: admin / admin</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffebee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorGeneralText: {
    fontSize: 14,
    color: "#F44336",
    marginLeft: 8,
    flex: 1,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 42,
    padding: 8,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  forgotPasswordButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "500",
  },
  testCredentials: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.2)",
  },
  testTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2196F3",
    marginBottom: 8,
    textAlign: "center",
  },
  testText: {
    fontSize: 12,
    color: "#2196F3",
    textAlign: "center",
    marginBottom: 2,
  },
})

export default Login
