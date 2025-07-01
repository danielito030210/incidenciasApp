"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "../context/NavigationContext"
import { useUsuarios } from "../context/UsuariosContext"

// Componentes
import SectionHeader from "../components/SectionHeader"
import InputField from "../components/InputField"
import SelectButton from "../components/SelectButton"
import LoadingButton from "../components/LoadingButton"
import CustomModal from "../components/CustomModal"
import ModalOption from "../components/ModalOption"
import ToggleSwitch from "../components/ToggleSwitch"

interface FormData {
  nombreCompleto: string
  correoElectronico: string
  nombreUsuario: string
  contraseña: string
  confirmarContraseña: string
  rol: "trabajador" | "administrador" | ""
  estado: "activo" | "inactivo"
}

interface FormErrors {
  nombreCompleto?: string
  correoElectronico?: string
  nombreUsuario?: string
  contraseña?: string
  confirmarContraseña?: string
  rol?: string
}

const CrearUsuario: React.FC = () => {
  const { navigate } = useNavigation()
  const { crearUsuario, usuarios } = useUsuarios()

  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: "",
    correoElectronico: "",
    nombreUsuario: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "",
    estado: "activo",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showRolModal, setShowRolModal] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    contraseña: false,
    confirmar: false,
  })

  const roles = [
    { label: "Trabajador", value: "trabajador" as const, icon: "person" },
    { label: "Administrador", value: "administrador" as const, icon: "shield-checkmark" },
  ]

  const handleInputChange = (field: keyof FormData, value: string | "activo" | "inactivo") => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const selectRol = (rol: "trabajador" | "administrador") => {
    handleInputChange("rol", rol)
    setShowRolModal(false)
  }

  const getRolText = (rol: string) => {
    const rolObj = roles.find((r) => r.value === rol)
    return rolObj ? rolObj.label : "Seleccionar rol..."
  }

  const togglePasswordVisibility = (field: "contraseña" | "confirmar") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre completo
    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es requerido"
    } else if (formData.nombreCompleto.trim().length < 3) {
      newErrors.nombreCompleto = "El nombre debe tener al menos 3 caracteres"
    }

    // Validar correo electrónico
    if (!formData.correoElectronico.trim()) {
      newErrors.correoElectronico = "El correo electrónico es requerido"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correoElectronico)) {
        newErrors.correoElectronico = "Ingresa un correo electrónico válido"
      } else {
        // TODO: Verificar si el email ya existe via API
        // Ejemplo: const response = await fetch(`/api/usuarios/check-email?email=${formData.correoElectronico}`)
        // const { exists } = await response.json()
        // if (exists) { newErrors.correoElectronico = "Este correo ya está registrado" }

        // TEMPORAL: Verificación local hasta conectar API
        const emailExiste = usuarios.some(
          (usuario) => usuario.email.toLowerCase() === formData.correoElectronico.toLowerCase(),
        )
        if (emailExiste) {
          newErrors.correoElectronico = "Este correo electrónico ya está registrado"
        }
      }
    }

    // Validar nombre de usuario
    if (!formData.nombreUsuario.trim()) {
      newErrors.nombreUsuario = "El nombre de usuario es requerido"
    } else if (formData.nombreUsuario.trim().length < 3) {
      newErrors.nombreUsuario = "El nombre de usuario debe tener al menos 3 caracteres"
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.nombreUsuario)) {
      newErrors.nombreUsuario = "Solo se permiten letras, números, puntos, guiones y guiones bajos"
    } else {
      // TODO: Verificar si el nombre de usuario ya existe via API
      // Ejemplo: const response = await fetch(`/api/usuarios/check-username?username=${formData.nombreUsuario}`)
      // const { exists } = await response.json()
      // if (exists) { newErrors.nombreUsuario = "Este nombre de usuario ya está en uso" }

      // TEMPORAL: Verificación local hasta conectar API
      const usuarioExiste = usuarios.some(
        (usuario) => usuario.nombre.toLowerCase() === formData.nombreUsuario.toLowerCase(),
      )
      if (usuarioExiste) {
        newErrors.nombreUsuario = "Este nombre de usuario ya está en uso"
      }
    }

    // Validar contraseña
    if (!formData.contraseña.trim()) {
      newErrors.contraseña = "La contraseña es requerida"
    } else if (formData.contraseña.length < 6) {
      newErrors.contraseña = "La contraseña debe tener al menos 6 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.contraseña)) {
      newErrors.contraseña = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    }

    // Validar confirmación de contraseña
    if (!formData.confirmarContraseña.trim()) {
      newErrors.confirmarContraseña = "Confirma la contraseña"
    } else if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden"
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = "Selecciona un rol para el usuario"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // TODO: Crear usuario via API
      // Ejemplo: const response = await fetch('/api/usuarios', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     nombre: formData.nombreCompleto.trim(),
      //     email: formData.correoElectronico.trim().toLowerCase(),
      //     username: formData.nombreUsuario.trim(),
      //     password: formData.contraseña,
      //     rol: formData.rol,
      //     estado: formData.estado
      //   })
      // })
      // const usuarioCreado = await response.json()

      await crearUsuario({
        nombre: formData.nombreCompleto.trim(),
        email: formData.correoElectronico.trim().toLowerCase(),
        rol: formData.rol as "administrador" | "trabajador",
        estado: formData.estado,
      })

      Alert.alert(
        "✅ Usuario creado exitosamente",
        `El usuario ${formData.nombreCompleto} ha sido creado correctamente.\n\n` +
          `📧 Correo: ${formData.correoElectronico}\n` +
          `👤 Rol: ${getRolText(formData.rol)}\n` +
          `🔄 Estado: ${formData.estado === "activo" ? "Activo" : "Inactivo"}`,
        [
          {
            text: "Ver usuarios",
            onPress: () => navigate("GestionUsuarios"),
          },
          {
            text: "Crear otro",
            onPress: () => resetForm(),
          },
        ],
      )
    } catch (error: any) {
      Alert.alert("❌ Error", error.message || "No se pudo crear el usuario. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombreCompleto: "",
      correoElectronico: "",
      nombreUsuario: "",
      contraseña: "",
      confirmarContraseña: "",
      rol: "",
      estado: "activo",
    })
    setErrors({})
  }

  const handleCancel = () => {
    if (
      formData.nombreCompleto ||
      formData.correoElectronico ||
      formData.nombreUsuario ||
      formData.contraseña ||
      formData.rol
    ) {
      Alert.alert("Cancelar creación", "¿Estás seguro de que quieres cancelar? Se perderán todos los datos.", [
        { text: "Continuar editando", style: "cancel" },
        {
          text: "Cancelar",
          style: "destructive",
          onPress: () => navigate("GestionUsuarios"),
        },
      ])
    } else {
      navigate("GestionUsuarios")
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Crear Nuevo Usuario</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información Personal */}
        <View style={styles.section}>
          <SectionHeader title="Información Personal" subtitle="Datos básicos del usuario" />

          <View style={styles.formCard}>
            <InputField
              label="Nombre completo *"
              icon="person"
              placeholder="Ej: Juan Pérez González"
              value={formData.nombreCompleto}
              onChangeText={(value) => handleInputChange("nombreCompleto", value)}
              error={errors.nombreCompleto}
              autoCapitalize="words"
              containerStyle={styles.fieldContainer}
            />

            <InputField
              label="Correo electrónico *"
              icon="mail"
              placeholder="usuario@universidad.edu"
              value={formData.correoElectronico}
              onChangeText={(value) => handleInputChange("correoElectronico", value)}
              error={errors.correoElectronico}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.fieldContainer}
            />

            <InputField
              label="Nombre de usuario *"
              icon="at"
              placeholder="Ej: juan.perez"
              value={formData.nombreUsuario}
              onChangeText={(value) => handleInputChange("nombreUsuario", value)}
              error={errors.nombreUsuario}
              autoCapitalize="none"
              autoCorrect={false}
              containerStyle={styles.fieldContainer}
            />
          </View>
        </View>

        {/* Seguridad */}
        <View style={styles.section}>
          <SectionHeader title="Seguridad" subtitle="Configuración de acceso" />

          <View style={styles.formCard}>
            <InputField
              label="Contraseña *"
              icon="lock-closed"
              placeholder="Mínimo 6 caracteres"
              value={formData.contraseña}
              onChangeText={(value) => handleInputChange("contraseña", value)}
              error={errors.contraseña}
              secureTextEntry={!showPasswords.contraseña}
              autoCapitalize="none"
              containerStyle={styles.fieldContainer}
              rightIcon={
                <TouchableOpacity onPress={() => togglePasswordVisibility("contraseña")}>
                  <Ionicons name={showPasswords.contraseña ? "eye-off" : "eye"} size={20} color="#666" />
                </TouchableOpacity>
              }
            />

            <InputField
              label="Confirmar contraseña *"
              icon="lock-closed"
              placeholder="Repite la contraseña"
              value={formData.confirmarContraseña}
              onChangeText={(value) => handleInputChange("confirmarContraseña", value)}
              error={errors.confirmarContraseña}
              secureTextEntry={!showPasswords.confirmar}
              autoCapitalize="none"
              containerStyle={styles.fieldContainer}
              rightIcon={
                <TouchableOpacity onPress={() => togglePasswordVisibility("confirmar")}>
                  <Ionicons name={showPasswords.confirmar ? "eye-off" : "eye"} size={20} color="#666" />
                </TouchableOpacity>
              }
            />

            <Text style={styles.passwordHint}>
              💡 La contraseña debe contener al menos una mayúscula, una minúscula y un número
            </Text>
          </View>
        </View>

        {/* Permisos y Estado */}
        <View style={styles.section}>
          <SectionHeader title="Permisos y Estado" subtitle="Configuración del rol y acceso" />

          <View style={styles.formCard}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Rol del usuario *</Text>
              <SelectButton
                onPress={() => setShowRolModal(true)}
                placeholder="Seleccionar rol..."
                value={getRolText(formData.rol)}
              />
              {errors.rol && <Text style={styles.errorText}>{errors.rol}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.toggleContainer}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.fieldLabel}>Estado de la cuenta</Text>
                  <Text style={styles.toggleDescription}>
                    {formData.estado === "activo"
                      ? "✅ La cuenta estará activa y el usuario podrá iniciar sesión"
                      : "❌ La cuenta estará inactiva y el usuario no podrá acceder"}
                  </Text>
                </View>
                <ToggleSwitch
                  value={formData.estado === "activo"}
                  onValueChange={(value) => handleInputChange("estado", value ? "activo" : "inactivo")}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Botones de Acción */}
        <View style={styles.section}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Ionicons name="close" size={20} color="#666" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <LoadingButton
              title="➕ Crear Usuario"
              onPress={handleSubmit}
              loading={loading}
              icon="person-add"
              backgroundColor="#4CAF50"
              style={styles.createButton}
              keepTextWhileLoading={true}
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal de Rol */}
      <CustomModal visible={showRolModal} title="Seleccionar Rol" onClose={() => setShowRolModal(false)}>
        {roles.map((rol) => (
          <ModalOption
            key={rol.value}
            onPress={() => selectRol(rol.value)}
            isSelected={formData.rol === rol.value}
            icon={rol.icon}
          >
            <Text style={styles.modalOptionText}>{rol.label}</Text>
          </ModalOption>
        ))}
      </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
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
  },
  section: {
    padding: 20,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#F44336",
    marginTop: 6,
    marginLeft: 4,
  },
  passwordHint: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    lineHeight: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    marginLeft: 8,
  },
  createButton: {
    flex: 2,
    paddingVertical: 16,
  },
  bottomSpacing: {
    height: 20,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
})

export default CrearUsuario
