"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity, Alert, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "../context/NavigationContext"
import { useIncidencias } from "../context/IncidenciasContext"

// Componentes
import SectionHeader from "../components/SectionHeader"
import SelectButton from "../components/SelectButton"
import CustomModal from "../components/CustomModal"
import ModalOption from "../components/ModalOption"
import LoadingButton from "../components/LoadingButton"

interface FiltrosExportacion {
  fechaDesde: string
  fechaHasta: string
  estado: string
  tipoIncidencia: string
  prioridad: string
  trabajador: string
  formatoExportacion: string
  enviarEmail: boolean
}

const ExportarReportes: React.FC = () => {
  const { navigate } = useNavigation()
  const { incidencias, obtenerEstadisticas } = useIncidencias()

  const [filtros, setFiltros] = useState<FiltrosExportacion>({
    fechaDesde: "",
    fechaHasta: "",
    estado: "",
    tipoIncidencia: "",
    prioridad: "",
    trabajador: "",
    formatoExportacion: "",
    enviarEmail: false,
  })

  const [modalesAbiertos, setModalesAbiertos] = useState({
    estado: false,
    tipo: false,
    prioridad: false,
    formato: false,
  })

  const [loading, setLoading] = useState(false)

  // Opciones para los filtros
  const estadosOpciones = [
    { label: "Todos los estados", value: "todos" },
    { label: "Pendiente", value: "pendiente" },
    { label: "En Proceso", value: "enProceso" },
    { label: "Resuelto", value: "resuelto" },
  ]

  const tiposOpciones = [
    { label: "Todos los tipos", value: "todos" },
    { label: "Hardware", value: "hardware" },
    { label: "Software", value: "software" },
    { label: "Red", value: "red" },
    { label: "Mantenimiento", value: "mantenimiento" },
    { label: "Otros", value: "otro" },
  ]

  const prioridadesOpciones = [
    { label: "Todas las prioridades", value: "todas" },
    { label: "Alta", value: "alta" },
    { label: "Media", value: "media" },
    { label: "Baja", value: "baja" },
  ]

  const formatosOpciones = [
    { label: "PDF", value: "pdf", icon: "document-text" },
    { label: "Excel", value: "excel", icon: "grid" },
    { label: "Word", value: "word", icon: "document" },
  ]

  const handleInputChange = (field: keyof FiltrosExportacion, value: string | boolean) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const abrirModal = (tipo: keyof typeof modalesAbiertos) => {
    setModalesAbiertos((prev) => ({
      ...prev,
      [tipo]: true,
    }))
  }

  const cerrarModal = (tipo: keyof typeof modalesAbiertos) => {
    setModalesAbiertos((prev) => ({
      ...prev,
      [tipo]: false,
    }))
  }

  const seleccionarOpcion = (tipo: keyof typeof modalesAbiertos, valor: string) => {
    const campos = {
      estado: "estado",
      tipo: "tipoIncidencia",
      prioridad: "prioridad",
      formato: "formatoExportacion",
    }

    handleInputChange(campos[tipo] as keyof FiltrosExportacion, valor)
    cerrarModal(tipo)
  }

  const obtenerTextoOpcion = (opciones: any[], valor: string) => {
    const opcion = opciones.find((opt) => opt.value === valor)
    return opcion ? opcion.label : "Seleccionar..."
  }

  const obtenerIncidenciasFiltradas = () => {
    let incidenciasFiltradas = [...incidencias]

    // Aplicar filtros localmente para preview
    if (filtros.estado && filtros.estado !== "todos") {
      incidenciasFiltradas = incidenciasFiltradas.filter((inc) => inc.estado === filtros.estado)
    }

    if (filtros.tipoIncidencia && filtros.tipoIncidencia !== "todos") {
      incidenciasFiltradas = incidenciasFiltradas.filter((inc) => inc.tipoIncidencia === filtros.tipoIncidencia)
    }

    if (filtros.prioridad && filtros.prioridad !== "todas") {
      incidenciasFiltradas = incidenciasFiltradas.filter((inc) => inc.prioridad === filtros.prioridad)
    }

    if (filtros.trabajador.trim()) {
      incidenciasFiltradas = incidenciasFiltradas.filter((inc) =>
        inc.usuarioCreador?.toLowerCase().includes(filtros.trabajador.toLowerCase()),
      )
    }

    return incidenciasFiltradas
  }

  const validarFormulario = (): boolean => {
    if (!filtros.formatoExportacion) {
      Alert.alert("Error", "Por favor selecciona un formato de exportación")
      return false
    }
    return true
  }

  const exportarReporte = async () => {
    if (!validarFormulario()) return

    setLoading(true)
    try {
      // TODO: Llamar a API para generar y descargar reporte
      // Ejemplo: const response = await fetch('/api/reportes/exportar', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     filtros,
      //     formato: filtros.formatoExportacion
      //   })
      // })

      // TODO: Manejar descarga del archivo
      // if (response.ok) {
      //   const blob = await response.blob()
      //   const url = window.URL.createObjectURL(blob)
      //   const a = document.createElement('a')
      //   a.href = url
      //   a.download = `reporte-incidencias.${filtros.formatoExportacion}`
      //   document.body.appendChild(a)
      //   a.click()
      //   window.URL.revokeObjectURL(url)
      //   document.body.removeChild(a)
      // }

      // TODO: Si enviarEmail es true, enviar copia por correo
      // if (filtros.enviarEmail) {
      //   await fetch('/api/reportes/enviar-email', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${token}`
      //     },
      //     body: JSON.stringify({ filtros, formato: filtros.formatoExportacion })
      //   })
      // }

      console.log("Exportando reporte con filtros:", filtros)

      // TEMPORAL: Simulación hasta conectar API
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const incidenciasFiltradas = obtenerIncidenciasFiltradas()
      const formato = formatosOpciones.find((f) => f.value === filtros.formatoExportacion)?.label

      let mensaje = `Reporte exportado exitosamente en formato ${formato}.\n\n`
      mensaje += `📊 Resumen:\n`
      mensaje += `• ${incidenciasFiltradas.length} incidencias incluidas\n`

      if (filtros.enviarEmail) {
        mensaje += `• Copia enviada al correo del administrador\n`
      }

      Alert.alert("Exportación Completada", mensaje, [
        {
          text: "OK",
          onPress: () => {
            // Limpiar formulario
            setFiltros({
              fechaDesde: "",
              fechaHasta: "",
              estado: "",
              tipoIncidencia: "",
              prioridad: "",
              trabajador: "",
              formatoExportacion: "",
              enviarEmail: false,
            })
          },
        },
      ])
    } catch (error) {
      console.error("Error exportando reporte:", error)
      Alert.alert("Error", "No se pudo exportar el reporte. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const incidenciasFiltradas = obtenerIncidenciasFiltradas()

  const volverAlDashboard = () => {
    navigate("Dashboard")
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={volverAlDashboard}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Exportar Reportes</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filtros de Búsqueda */}
        <View style={styles.section}>
          <SectionHeader title="Filtros de Búsqueda" subtitle="Personaliza los datos a exportar" />

          <View style={styles.formCard}>
            {/* TODO: Implementar selector de fechas real */}
            {/* Rango de Fechas */}
            <View style={styles.dateRangeContainer}>
              <View style={styles.dateField}>
                <Text style={styles.fieldLabel}>Fecha desde</Text>
                <TouchableOpacity style={styles.dateInput}>
                  <Ionicons name="calendar" size={20} color="#666" />
                  <Text style={styles.dateText}>{filtros.fechaDesde || "Seleccionar"}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateField}>
                <Text style={styles.fieldLabel}>Fecha hasta</Text>
                <TouchableOpacity style={styles.dateInput}>
                  <Ionicons name="calendar" size={20} color="#666" />
                  <Text style={styles.dateText}>{filtros.fechaHasta || "Seleccionar"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Estado */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Estado del reporte</Text>
              <SelectButton
                onPress={() => abrirModal("estado")}
                placeholder="Seleccionar estado..."
                value={obtenerTextoOpcion(estadosOpciones, filtros.estado)}
              />
            </View>

            {/* Tipo de Incidencia */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tipo de incidencia</Text>
              <SelectButton
                onPress={() => abrirModal("tipo")}
                placeholder="Seleccionar tipo..."
                value={obtenerTextoOpcion(tiposOpciones, filtros.tipoIncidencia)}
              />
            </View>

            {/* Prioridad */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Prioridad</Text>
              <SelectButton
                onPress={() => abrirModal("prioridad")}
                placeholder="Seleccionar prioridad..."
                value={obtenerTextoOpcion(prioridadesOpciones, filtros.prioridad)}
              />
            </View>

            {/* Trabajador */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Buscar por trabajador (opcional)</Text>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Nombre del trabajador..."
                  value={filtros.trabajador}
                  onChangeText={(value) => handleInputChange("trabajador", value)}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Vista Previa de Resultados */}
        <View style={styles.section}>
          <SectionHeader title="Vista Previa" subtitle="Resumen de los datos a exportar" />

          <View style={styles.previewCard}>
            <View style={styles.previewStats}>
              <View style={styles.previewStat}>
                <Text style={styles.previewNumber}>{incidenciasFiltradas.length}</Text>
                <Text style={styles.previewLabel}>Incidencias</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewNumber}>
                  {incidenciasFiltradas.filter((i) => i.estado === "pendiente").length}
                </Text>
                <Text style={styles.previewLabel}>Pendientes</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewNumber}>
                  {incidenciasFiltradas.filter((i) => i.estado === "resuelto").length}
                </Text>
                <Text style={styles.previewLabel}>Resueltas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Formato de Exportación */}
        <View style={styles.section}>
          <SectionHeader title="Formato de Exportación" subtitle="Selecciona el formato del archivo" />

          <View style={styles.formatCard}>
            <View style={styles.formatButtons}>
              {formatosOpciones.map((formato) => (
                <TouchableOpacity
                  key={formato.value}
                  style={[
                    styles.formatButton,
                    filtros.formatoExportacion === formato.value && styles.formatButtonSelected,
                  ]}
                  onPress={() => handleInputChange("formatoExportacion", formato.value)}
                >
                  <Ionicons
                    name={formato.icon as any}
                    size={32}
                    color={filtros.formatoExportacion === formato.value ? "#2196F3" : "#666"}
                  />
                  <Text
                    style={[
                      styles.formatButtonText,
                      filtros.formatoExportacion === formato.value && styles.formatButtonTextSelected,
                    ]}
                  >
                    {formato.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Opciones Adicionales */}
        <View style={styles.section}>
          <SectionHeader title="Opciones Adicionales" />

          <View style={styles.optionsCard}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleInputChange("enviarEmail", !filtros.enviarEmail)}
            >
              <View style={[styles.checkbox, filtros.enviarEmail && styles.checkboxChecked]}>
                {filtros.enviarEmail && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>Enviar una copia al correo electrónico del administrador</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de Exportación */}
        <View style={styles.section}>
          <LoadingButton
            title="📥 Exportar Reporte"
            onPress={exportarReporte}
            loading={loading}
            icon="download"
            backgroundColor="#4CAF50"
            style={styles.exportButton}
            keepTextWhileLoading={true}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modales */}
      <CustomModal visible={modalesAbiertos.estado} title="Seleccionar Estado" onClose={() => cerrarModal("estado")}>
        {estadosOpciones.map((opcion) => (
          <ModalOption
            key={opcion.value}
            onPress={() => seleccionarOpcion("estado", opcion.value)}
            isSelected={filtros.estado === opcion.value}
          >
            <Text style={styles.modalOptionText}>{opcion.label}</Text>
          </ModalOption>
        ))}
      </CustomModal>

      <CustomModal visible={modalesAbiertos.tipo} title="Seleccionar Tipo" onClose={() => cerrarModal("tipo")}>
        {tiposOpciones.map((opcion) => (
          <ModalOption
            key={opcion.value}
            onPress={() => seleccionarOpcion("tipo", opcion.value)}
            isSelected={filtros.tipoIncidencia === opcion.value}
          >
            <Text style={styles.modalOptionText}>{opcion.label}</Text>
          </ModalOption>
        ))}
      </CustomModal>

      <CustomModal
        visible={modalesAbiertos.prioridad}
        title="Seleccionar Prioridad"
        onClose={() => cerrarModal("prioridad")}
      >
        {prioridadesOpciones.map((opcion) => (
          <ModalOption
            key={opcion.value}
            onPress={() => seleccionarOpcion("prioridad", opcion.value)}
            isSelected={filtros.prioridad === opcion.value}
          >
            <Text style={styles.modalOptionText}>{opcion.label}</Text>
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
  },
  section: {
    padding: 20,
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateField: {
    flex: 1,
    marginHorizontal: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  previewStat: {
    alignItems: "center",
  },
  previewNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 4,
  },
  previewLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  formatCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formatButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  formatButton: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
    minWidth: 80,
  },
  formatButtonSelected: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  formatButtonTextSelected: {
    color: "#2196F3",
  },
  optionsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  exportButton: {
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

export default ExportarReportes
