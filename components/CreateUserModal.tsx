"use client"

import type React from "react"
import { useState } from "react"
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import InputField from "./InputField"
import LoadingButton from "./LoadingButton"
import SelectButton from "./SelectButton"
import CustomModal from "./CustomModal"
import ModalOption from "./ModalOption"

interface CreateUserModalProps {
  visible: boolean
  onClose: () => void
  onCreateUser: (userData: {
    nombre: string
    email: string
    rol: "administrador" | "trabajador"
    estado: "activo" | "inactivo"
  }) => void
}

interface UserFormData {
  nombre: string
  email: string
  password: string
  confirmPassword: string
  rol: "administrador" | "trabajador" | ""
  estado: "activo" | "inactivo"
}

interface FormErrors {
  nombre?: string
  email?: string
  password?: string
  confirmPassword?: string
  rol?: string
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ visible, onClose, onCreateUser }) => {
  const [formData, setFormData] = useState<UserFormData>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "",
    estado: "activo",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showRolModal, setShowRolModal] = useState(false)

  const roles = [
    { label: "Trabajador", value: "trabajador" as const },
    { label: "Administrador", value: "administrador" as const },
  ]

  const handleInputChange = (field: keyof UserFormData, value: string) => {
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

  const selectRol = (rol: "administrador" | "trabajador") => {
    handleInputChange("rol", rol)
    setShowRolModal(false)
  }

  const getRolText = (rol: string) => {
    const rolObj = roles.find((r) => r.value === rol)
    return rolObj ? rolObj.label : "Seleccionar rol..."
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Ingresa un correo electrónico válido"
      }
    }

    // Validar contraseña
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirma la contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    // Validar rol
    if (!formData.rol) {
      newErrors.rol = "Selecciona un rol"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Simular creación de usuario
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onCreateUser({
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        rol: formData.rol as "administrador" | "trabajador",
        estado: formData.estado,
      })

      Alert.alert("Usuario creado", "El usuario ha sido creado exitosamente.", [
        {
          text: "OK",
          onPress: () => {
            resetForm()
            onClose()
          },
        },
      ])
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el usuario. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      confirmPassword: "",
      rol: "",
      estado: "activo",
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <>
      <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={handleClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Crear Nuevo Usuario</Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Formulario */}
              <View style={styles.form}>
                <InputField
                  label="Nombre completo"
                  icon="person"
                  placeholder="Ingresa el nombre completo"
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange("nombre", value)}
                  error={errors.nombre}
                  autoCapitalize="words"
                />

                <InputField
                  label="Correo electrónico"
                  icon="mail"
                  placeholder="usuario@universidad.edu"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <InputField
                  label="Contraseña"
                  icon="lock-closed"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  error={errors.password}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />

                <InputField
                  label="Confirmar contraseña"
                  icon="lock-closed"
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange("confirmPassword", value)}
                  error={errors.confirmPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                />

                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Rol *</Text>
                  <SelectButton
                    onPress={() => setShowRolModal(true)}
                    placeholder="Seleccionar rol..."
                    value={getRolText(formData.rol)}
                  />
                  {errors.rol && <Text style={styles.errorText}>{errors.rol}</Text>}
                </View>
              </View>

              {/* Botones */}
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <LoadingButton
                  title="Crear Usuario"
                  onPress={handleSubmit}
                  loading={loading}
                  icon="person-add"
                  backgroundColor="#4CAF50"
                  style={styles.createButton}
                  keepTextWhileLoading={true}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Rol */}
      <CustomModal visible={showRolModal} title="Seleccionar Rol" onClose={() => setShowRolModal(false)}>
        {roles.map((rol) => (
          <ModalOption key={rol.value} onPress={() => selectRol(rol.value)} isSelected={formData.rol === rol.value}>
            <Text style={styles.modalOptionText}>{rol.label}</Text>
          </ModalOption>
        ))}
      </CustomModal>
    </>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    padding: 20,
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
  buttons: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f9fa",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
})

export default CreateUserModal
