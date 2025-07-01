"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Componentes reutilizables
import CustomModal from "./components/CustomModal"
import ModalOption from "./components/ModalOption"
import FormField from "./components/FormField"
import SelectButton from "./components/SelectButton"
import ImagePreview from "./components/ImagePreview"
import PrimaryButton from "./components/PrimaryButton"

// Tipos
import type { FormData, TipoIncidencia, Prioridad } from "./types"

// Context
import { useIncidencias } from "./context/IncidenciasContext"
import { useNavigation } from "./context/NavigationContext"

interface CrearIncidenciaProps {
  onSubmit?: (formData: FormData) => void
}

const CrearIncidencia: React.FC<CrearIncidenciaProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    tipoIncidencia: "",
    descripcion: "",
    prioridad: "",
    ubicacion: "",
    imagen: null,
  })

  const [showTipoModal, setShowTipoModal] = useState<boolean>(false)
  const [showPrioridadModal, setShowPrioridadModal] = useState<boolean>(false)
  const [showImageModal, setShowImageModal] = useState<boolean>(false)

  const tiposIncidencia: TipoIncidencia[] = [
    { label: "Hardware", value: "hardware" },
    { label: "Software", value: "software" },
    { label: "Red", value: "red" },
    { label: "Otro", value: "otro" },
  ]

  const prioridades: Prioridad[] = [
    { label: "Baja", value: "baja", color: "#4CAF50" },
    { label: "Media", value: "media", color: "#FF9800" },
    { label: "Alta", value: "alta", color: "#F44336" },
  ]

  const handleInputChange = (field: keyof FormData, value: any): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const selectTipoIncidencia = (tipo: TipoIncidencia): void => {
    handleInputChange("tipoIncidencia", tipo.value)
    setShowTipoModal(false)
  }

  const selectPrioridad = (prioridad: Prioridad): void => {
    handleInputChange("prioridad", prioridad.value)
    setShowPrioridadModal(false)
  }

  const handleImageOption = (option: "camera" | "gallery"): void => {
    setShowImageModal(false)

    if (option === "camera") {
      Alert.alert(
        "Cámara",
        "Funcionalidad de cámara simulada. En una implementación real, aquí se abriría la cámara.",
        [
          { text: "Cancelar" },
          {
            text: "Simular foto",
            onPress: () =>
              handleInputChange("imagen", {
                uri: "https://via.placeholder.com/300x200/cccccc/666666?text=Foto+Simulada",
                name: "foto_incidencia.jpg",
              }),
          },
        ],
      )
    } else if (option === "gallery") {
      Alert.alert(
        "Galería",
        "Funcionalidad de galería simulada. En una implementación real, aquí se abriría la galería.",
        [
          { text: "Cancelar" },
          {
            text: "Simular selección",
            onPress: () =>
              handleInputChange("imagen", {
                uri: "https://via.placeholder.com/300x200/e3f2fd/1976d2?text=Imagen+de+Galeria",
                name: "imagen_galeria.jpg",
              }),
          },
        ],
      )
    }
  }

  const validateForm = (): boolean => {
    if (!formData.tipoIncidencia) {
      Alert.alert("Error", "Por favor selecciona el tipo de incidencia")
      return false
    }
    if (!formData.descripcion.trim()) {
      Alert.alert("Error", "Por favor describe el problema")
      return false
    }
    if (!formData.prioridad) {
      Alert.alert("Error", "Por favor selecciona la prioridad")
      return false
    }
    if (!formData.ubicacion.trim()) {
      Alert.alert("Error", "Por favor indica la ubicación")
      return false
    }
    return true
  }

  const { agregarIncidencia } = useIncidencias()
  const { navigate } = useNavigation()

  const handleSubmit = (): void => {
    if (!validateForm()) return

    Alert.alert("Confirmar envío", "¿Estás seguro de que quieres enviar este reporte?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Enviar",
        onPress: () => {
          // Agregar la incidencia al contexto
          agregarIncidencia({
            tipoIncidencia: formData.tipoIncidencia,
            descripcion: formData.descripcion,
            prioridad: formData.prioridad,
            ubicacion: formData.ubicacion,
            imagen: formData.imagen,
          })

          if (onSubmit) {
            onSubmit(formData)
          }

          Alert.alert(
            "Incidencia enviada",
            "Tu incidencia ha sido enviada exitosamente. Te notificaremos cuando se actualice su estado.",
            [
              {
                text: "OK",
                onPress: () => {
                  resetForm()
                  navigate("Dashboard")
                },
              },
            ],
          )
        },
      },
    ])
  }

  const resetForm = (): void => {
    setFormData({
      tipoIncidencia: "",
      descripcion: "",
      prioridad: "",
      ubicacion: "",
      imagen: null,
    })
  }

  const getTipoLabel = (): string => {
    const tipo = tiposIncidencia.find((t) => t.value === formData.tipoIncidencia)
    return tipo ? tipo.label : "Seleccionar tipo..."
  }

  const getPrioridadLabel = (): string => {
    const prioridad = prioridades.find((p) => p.value === formData.prioridad)
    return prioridad ? prioridad.label : "Seleccionar prioridad..."
  }

  const getPrioridadColor = (): string => {
    const prioridad = prioridades.find((p) => p.value === formData.prioridad)
    return prioridad ? prioridad.color : "#666"
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate("Dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Crear Incidencia</Text>
          <Text style={styles.subtitle}>Reporta un problema técnico</Text>
        </View>
      </View>

      <View style={styles.form}>
        {/* Tipo de Incidencia */}
        <FormField label="Tipo de Incidencia" required>
          <SelectButton
            onPress={() => setShowTipoModal(true)}
            placeholder="Seleccionar tipo..."
            value={getTipoLabel()}
          />
        </FormField>

        {/* Descripción */}
        <FormField label="Descripción del Problema" required>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe detalladamente el problema..."
            value={formData.descripcion}
            onChangeText={(value) => handleInputChange("descripcion", value)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </FormField>

        {/* Prioridad */}
        <FormField label="Prioridad" required>
          <SelectButton
            onPress={() => setShowPrioridadModal(true)}
            placeholder="Seleccionar prioridad..."
            value={getPrioridadLabel()}
            showIndicator={!!formData.prioridad}
            indicatorColor={getPrioridadColor()}
          />
        </FormField>

        {/* Ubicación */}
        <FormField label="Ubicación" required>
          <TextInput
            style={styles.input}
            placeholder="Ej: Oficina 205, Planta 2"
            value={formData.ubicacion}
            onChangeText={(value) => handleInputChange("ubicacion", value)}
          />
        </FormField>

        {/* Foto del Incidente */}
        <FormField label="Foto del Incidente">
          <TouchableOpacity style={styles.imageButton} onPress={() => setShowImageModal(true)}>
            <Ionicons name="camera" size={24} color="#666" />
            <Text style={styles.imageButtonText}>{formData.imagen ? "Cambiar imagen" : "Agregar foto"}</Text>
          </TouchableOpacity>

          {formData.imagen && (
            <ImagePreview image={formData.imagen} onRemove={() => handleInputChange("imagen", null)} />
          )}
        </FormField>

        {/* Botón de Envío */}
        <PrimaryButton title="Enviar Reporte" onPress={handleSubmit} icon="send" />
      </View>

      {/* Modal Tipo de Incidencia */}
      <CustomModal
        visible={showTipoModal}
        title="Seleccionar Tipo de Incidencia"
        onClose={() => setShowTipoModal(false)}
      >
        {tiposIncidencia.map((tipo) => (
          <ModalOption
            key={tipo.value}
            onPress={() => selectTipoIncidencia(tipo)}
            isSelected={formData.tipoIncidencia === tipo.value}
          >
            <Text style={styles.modalOptionText}>{tipo.label}</Text>
          </ModalOption>
        ))}
      </CustomModal>

      {/* Modal Prioridad */}
      <CustomModal
        visible={showPrioridadModal}
        title="Seleccionar Prioridad"
        onClose={() => setShowPrioridadModal(false)}
      >
        {prioridades.map((prioridad) => (
          <ModalOption
            key={prioridad.value}
            onPress={() => selectPrioridad(prioridad)}
            isSelected={formData.prioridad === prioridad.value}
          >
            <View style={styles.prioridadOptionContainer}>
              <View style={[styles.prioridadIndicator, { backgroundColor: prioridad.color }]} />
              <Text style={styles.modalOptionText}>{prioridad.label}</Text>
            </View>
          </ModalOption>
        ))}
      </CustomModal>

      {/* Modal Imagen */}
      <CustomModal visible={showImageModal} title="Agregar Imagen" onClose={() => setShowImageModal(false)}>
        <ModalOption onPress={() => handleImageOption("camera")} icon="camera">
          <Text style={styles.modalOptionText}>Tomar foto</Text>
        </ModalOption>
        <ModalOption onPress={() => handleImageOption("gallery")} icon="images">
          <Text style={styles.modalOptionText}>Seleccionar de galería</Text>
        </ModalOption>
      </CustomModal>
    </ScrollView>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imageButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  prioridadOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prioridadIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
})

export default CrearIncidencia
