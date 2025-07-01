"use client"

import type React from "react"
import { ScrollView, View, Text, TouchableOpacity, Alert, TextInput, Modal, StyleSheet, Platform } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useIncidencias, type Incidencia } from "../context/IncidenciasContext"
import { useNavigation } from "../context/NavigationContext"

interface HistorialIncidenciasAdminProps {
  filtroEstado?: "pendiente" | "enProceso" | "resuelto" | "todos"
}

const HistorialIncidenciasAdmin: React.FC<HistorialIncidenciasAdminProps> = ({ filtroEstado = "todos" }) => {
  const { incidencias, actualizarEstadoIncidencia, agregarComentarioAdmin } = useIncidencias()
  const { navigate } = useNavigation()
  const [modalComentario, setModalComentario] = useState<{ visible: boolean; incidenciaId: string }>({
    visible: false,
    incidenciaId: "",
  })
  const [textoComentario, setTextoComentario] = useState("")

  const [modalCambiarEstado, setModalCambiarEstado] = useState<{ visible: boolean; incidencia: Incidencia | null }>({
    visible: false,
    incidencia: null,
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "#FF9800"
      case "enProceso":
        return "#2196F3"
      case "resuelto":
        return "#4CAF50"
      default:
        return "#666"
    }
  }

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente"
      case "enProceso":
        return "En Proceso"
      case "resuelto":
        return "Resuelto"
      default:
        return estado
    }
  }

  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case "hardware":
        return "Hardware"
      case "software":
        return "Software"
      case "red":
        return "Red"
      case "otro":
        return "Otro"
      default:
        return tipo
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "baja":
        return "#4CAF50"
      case "media":
        return "#FF9800"
      case "alta":
        return "#F44336"
      default:
        return "#666"
    }
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatearFechaCorta = (fecha: Date) => {
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(horas / 24)

    if (dias > 0) {
      return `${dias}d`
    } else if (horas > 0) {
      return `${horas}h`
    } else {
      return "Ahora"
    }
  }

  const getIncidenciasFiltradas = () => {
    if (filtroEstado === "todos") {
      return incidencias
    }
    return incidencias.filter((inc) => inc.estado === filtroEstado)
  }

  const getTituloFiltro = () => {
    switch (filtroEstado) {
      case "pendiente":
        return "Incidencias Pendientes"
      case "enProceso":
        return "Incidencias En Proceso"
      case "resuelto":
        return "Incidencias Resueltas"
      default:
        return "Todas las Incidencias"
    }
  }

  const abrirModalCambiarEstado = (incidencia: Incidencia) => {
    setModalCambiarEstado({ visible: true, incidencia })
  }

  const cerrarModalCambiarEstado = () => {
    setModalCambiarEstado({ visible: false, incidencia: null })
  }

  const cambiarEstadoIncidencia = (nuevoEstado: "pendiente" | "enProceso" | "resuelto") => {
    if (!modalCambiarEstado.incidencia) return

    const comentarios = {
      pendiente: "Estado cambiado a pendiente por el administrador",
      enProceso: "Incidencia tomada en proceso por el equipo técnico",
      resuelto: "Incidencia marcada como resuelta por el administrador",
    }

    actualizarEstadoIncidencia(
      modalCambiarEstado.incidencia.id,
      nuevoEstado,
      comentarios[nuevoEstado],
      "Administrador Sistema",
    )

    Alert.alert("Éxito", `Estado cambiado a ${getEstadoTexto(nuevoEstado)}`)
    cerrarModalCambiarEstado()
  }

  const abrirModalComentario = (incidenciaId: string) => {
    setModalComentario({ visible: true, incidenciaId })
    setTextoComentario("")
  }

  const cerrarModalComentario = () => {
    setModalComentario({ visible: false, incidenciaId: "" })
    setTextoComentario("")
  }

  const guardarComentario = () => {
    if (textoComentario.trim()) {
      agregarComentarioAdmin(modalComentario.incidenciaId, textoComentario.trim(), "Administrador Sistema", true)
      Alert.alert("Éxito", "Comentario agregado correctamente")
      cerrarModalComentario()
    } else {
      Alert.alert("Error", "Por favor ingresa un comentario válido")
    }
  }

  const incidenciasFiltradas = getIncidenciasFiltradas()

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate("Dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{getTituloFiltro()}</Text>
          <Text style={styles.subtitle}>{incidenciasFiltradas.length} incidencias</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {incidenciasFiltradas.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay incidencias</Text>
            <Text style={styles.emptySubtitle}>No se encontraron incidencias con este filtro</Text>
          </View>
        ) : (
          incidenciasFiltradas.map((incidencia) => (
            <View key={incidencia.id} style={styles.incidenciaCard}>
              {/* Información de la incidencia */}
              <View style={styles.cardHeader}>
                <View style={styles.idContainer}>
                  <Text style={styles.incidenciaId}>{incidencia.id}</Text>
                  <View style={styles.tipoContainer}>
                    <Ionicons name="document-text" size={14} color="#666" />
                    <Text style={styles.tipoText}>{getTipoTexto(incidencia.tipoIncidencia)}</Text>
                  </View>
                  <Text style={styles.usuarioCreador}>Por: {incidencia.usuarioCreador}</Text>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(incidencia.estado) }]}>
                  <Text style={styles.estadoText}>{getEstadoTexto(incidencia.estado)}</Text>
                </View>
              </View>

              <Text style={styles.descripcion} numberOfLines={3}>
                {incidencia.descripcion}
              </Text>

              <View style={styles.detalles}>
                <View style={styles.detalle}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.detalleText}>{incidencia.ubicacion}</Text>
                </View>
                <View style={styles.detalle}>
                  <Ionicons name="flag" size={14} color={getPrioridadColor(incidencia.prioridad)} />
                  <Text style={[styles.detalleText, { color: getPrioridadColor(incidencia.prioridad) }]}>
                    Prioridad {incidencia.prioridad}
                  </Text>
                </View>
              </View>

              {/* Comentarios del Administrador */}
              {incidencia.comentariosAdmin && incidencia.comentariosAdmin.length > 0 && (
                <View style={styles.comentariosSection}>
                  <Text style={styles.comentariosTitulo}>Comentarios del Administrador:</Text>
                  {incidencia.comentariosAdmin
                    .filter((comentario) => comentario.esVisible)
                    .map((comentario) => (
                      <View key={comentario.id} style={styles.comentarioCard}>
                        <View style={styles.comentarioHeader}>
                          <Ionicons name="chatbubble" size={12} color="#2196F3" />
                          <Text style={styles.comentarioUsuario}>{comentario.usuario}</Text>
                          <Text style={styles.comentarioFecha}>{formatearFechaCorta(comentario.fecha)}</Text>
                        </View>
                        <Text style={styles.comentarioTexto}>{comentario.mensaje}</Text>
                      </View>
                    ))}
                </View>
              )}

              <View style={styles.footer}>
                <Text style={styles.fechaText}>Creado: {formatearFecha(incidencia.fechaCreacion)}</Text>
              </View>

              {/* Acciones de Administrador */}
              {(incidencia.estado === "pendiente" || incidencia.estado === "enProceso") && (
                <View style={styles.adminActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cambiarEstadoButton]}
                    onPress={() => abrirModalCambiarEstado(incidencia)}
                  >
                    <Ionicons name="sync" size={16} color="#2196F3" />
                    <Text style={[styles.actionText, { color: "#2196F3" }]}>Cambiar Estado</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.comentarButton]}
                    onPress={() => abrirModalComentario(incidencia.id)}
                  >
                    <Ionicons name="chatbubble" size={16} color="#FF9800" />
                    <Text style={[styles.actionText, { color: "#FF9800" }]}>Comentar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modal para cambiar estado */}
      <Modal visible={modalCambiarEstado.visible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={cerrarModalCambiarEstado}>
            <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <Text style={styles.modalTitle}>Cambiar Estado</Text>
              <Text style={styles.modalSubtitle}>
                Selecciona el nuevo estado para {modalCambiarEstado.incidencia?.id}
              </Text>

              <View style={styles.estadoOptions}>
                {modalCambiarEstado.incidencia && (
                  <>
                    {modalCambiarEstado.incidencia.estado !== "pendiente" && (
                      <TouchableOpacity
                        style={[styles.estadoOption, { borderColor: "#FF9800", backgroundColor: "#FFF3E0" }]}
                        onPress={() => cambiarEstadoIncidencia("pendiente")}
                      >
                        <Ionicons name="time" size={20} color="#FF9800" />
                        <Text style={[styles.estadoOptionText, { color: "#FF9800" }]}>Pendiente</Text>
                      </TouchableOpacity>
                    )}

                    {modalCambiarEstado.incidencia.estado !== "enProceso" && (
                      <TouchableOpacity
                        style={[styles.estadoOption, { borderColor: "#2196F3", backgroundColor: "#E3F2FD" }]}
                        onPress={() => cambiarEstadoIncidencia("enProceso")}
                      >
                        <Ionicons name="sync" size={20} color="#2196F3" />
                        <Text style={[styles.estadoOptionText, { color: "#2196F3" }]}>En Proceso</Text>
                      </TouchableOpacity>
                    )}

                    {modalCambiarEstado.incidencia.estado !== "resuelto" && (
                      <TouchableOpacity
                        style={[styles.estadoOption, { borderColor: "#4CAF50", backgroundColor: "#E8F5E8" }]}
                        onPress={() => cambiarEstadoIncidencia("resuelto")}
                      >
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={[styles.estadoOptionText, { color: "#4CAF50" }]}>Resuelto</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>

              <TouchableOpacity style={styles.modalCancelButton} onPress={cerrarModalCambiarEstado}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal para agregar comentario */}
      <Modal visible={modalComentario.visible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Comentario</Text>
            <Text style={styles.modalSubtitle}>Comentario para {modalComentario.incidenciaId}</Text>

            <TextInput
              style={styles.comentarioInput}
              placeholder="Escribe tu comentario aquí..."
              value={textoComentario}
              onChangeText={setTextoComentario}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={cerrarModalComentario}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={guardarComentario}>
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  incidenciaCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  idContainer: {
    flex: 1,
  },
  incidenciaId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tipoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  tipoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  usuarioCreador: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  descripcion: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    marginBottom: 12,
    lineHeight: 20,
  },
  detalles: {
    marginBottom: 12,
  },
  detalle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detalleText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  comentariosSection: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  comentariosTitulo: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  comentarioCard: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  comentarioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  comentarioUsuario: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2196F3",
    marginLeft: 4,
    flex: 1,
  },
  comentarioFecha: {
    fontSize: 10,
    color: "#999",
  },
  comentarioTexto: {
    fontSize: 12,
    color: "#333",
    lineHeight: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginBottom: 12,
  },
  fechaText: {
    fontSize: 12,
    color: "#999",
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 120,
    justifyContent: "center",
  },
  cambiarEstadoButton: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  comentarButton: {
    backgroundColor: "#fff3e0",
    borderColor: "#FF9800",
  },
  actionText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 16,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  modalSaveText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  estadoOptions: {
    marginBottom: 20,
  },
  estadoOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 12,
  },
  estadoOptionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
})

export default HistorialIncidenciasAdmin
