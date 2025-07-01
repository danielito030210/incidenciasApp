import type React from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useIncidencias } from "../context/IncidenciasContext"
import { useNavigation } from "../context/NavigationContext"
import TimelineItem from "../components/TimelineItem"

const DetalleIncidencia: React.FC = () => {
  const { incidenciaSeleccionada, actualizarEstadoIncidencia } = useIncidencias()
  const { navigate } = useNavigation()

  if (!incidenciaSeleccionada) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigate("HistorialIncidencias")}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Detalle de Incidencia</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ccc" />
          <Text style={styles.errorText}>No se encontró la incidencia</Text>
        </View>
      </View>
    )
  }

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate("HistorialIncidencias")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalle de Incidencia</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información Principal */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.incidenciaId}>{incidenciaSeleccionada.id}</Text>
            <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(incidenciaSeleccionada.estado) }]}>
              <Text style={styles.estadoText}>{getEstadoTexto(incidenciaSeleccionada.estado)}</Text>
            </View>
          </View>

          <Text style={styles.descripcion}>{incidenciaSeleccionada.descripcion}</Text>

          <View style={styles.detallesGrid}>
            <View style={styles.detalleItem}>
              <Ionicons name="document-text" size={16} color="#666" />
              <Text style={styles.detalleLabel}>Tipo:</Text>
              <Text style={styles.detalleValue}>{getTipoTexto(incidenciaSeleccionada.tipoIncidencia)}</Text>
            </View>

            <View style={styles.detalleItem}>
              <Ionicons name="flag" size={16} color={getPrioridadColor(incidenciaSeleccionada.prioridad)} />
              <Text style={styles.detalleLabel}>Prioridad:</Text>
              <Text style={[styles.detalleValue, { color: getPrioridadColor(incidenciaSeleccionada.prioridad) }]}>
                {incidenciaSeleccionada.prioridad.charAt(0).toUpperCase() + incidenciaSeleccionada.prioridad.slice(1)}
              </Text>
            </View>

            <View style={styles.detalleItem}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.detalleLabel}>Ubicación:</Text>
              <Text style={styles.detalleValue}>{incidenciaSeleccionada.ubicacion}</Text>
            </View>

            <View style={styles.detalleItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.detalleLabel}>Creado:</Text>
              <Text style={styles.detalleValue}>{formatearFecha(incidenciaSeleccionada.fechaCreacion)}</Text>
            </View>
          </View>

          {incidenciaSeleccionada.imagen && (
            <View style={styles.imagenContainer}>
              <Text style={styles.imagenLabel}>Imagen adjunta:</Text>
              <View style={styles.imagenPlaceholder}>
                <Ionicons name="image" size={32} color="#666" />
                <Text style={styles.imagenNombre}>{incidenciaSeleccionada.imagen.name}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Historial de Cambios */}
        <View style={styles.historialCard}>
          <Text style={styles.historialTitle}>Historial de Cambios</Text>
          <Text style={styles.historialSubtitle}>Seguimiento completo del estado de la incidencia</Text>

          <View style={styles.timeline}>
            {incidenciaSeleccionada.historialCambios
              .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
              .map((cambio, index, array) => (
                <TimelineItem key={cambio.id} cambio={cambio} isLast={index === array.length - 1} />
              ))}
          </View>
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
  },
  mainCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  incidenciaId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  estadoText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
  descripcion: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  detallesGrid: {
    gap: 12,
  },
  detalleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detalleLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detalleValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  imagenContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  imagenLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  imagenPlaceholder: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  imagenNombre: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  historialCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historialTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  historialSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  timeline: {
    paddingLeft: 8,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default DetalleIncidencia
