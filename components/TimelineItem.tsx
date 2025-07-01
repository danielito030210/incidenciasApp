import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { CambioEstado } from "../context/IncidenciasContext"

interface TimelineItemProps {
  cambio: CambioEstado
  isLast: boolean
}

const TimelineItem: React.FC<TimelineItemProps> = ({ cambio, isLast }) => {
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

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "time"
      case "enProceso":
        return "sync"
      case "resuelto":
        return "checkmark-circle"
      default:
        return "radio-button-on"
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
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: getEstadoColor(cambio.estadoNuevo) }]}>
          <Ionicons name={getEstadoIcon(cambio.estadoNuevo) as any} size={16} color="white" />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.estado}>{getEstadoTexto(cambio.estadoNuevo)}</Text>
          <Text style={styles.fecha}>{formatearFecha(cambio.fecha)}</Text>
        </View>

        {cambio.comentario && <Text style={styles.comentario}>{cambio.comentario}</Text>}

        {cambio.usuario && <Text style={styles.usuario}>Por: {cambio.usuario}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeline: {
    alignItems: "center",
    marginRight: 16,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 8,
    minHeight: 20,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  estado: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  fecha: {
    fontSize: 12,
    color: "#666",
  },
  comentario: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 8,
  },
  usuario: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
})

export default TimelineItem
