import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Incidencia } from "../context/IncidenciasContext"

interface RecentIncidenciaCardProps {
  incidencia: Incidencia
  onPress: () => void
}

const RecentIncidenciaCard: React.FC<RecentIncidenciaCardProps> = ({ incidencia, onPress }) => {
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
    const ahora = new Date()
    const diferencia = ahora.getTime() - fecha.getTime()
    const horas = Math.floor(diferencia / (1000 * 60 * 60))
    const dias = Math.floor(horas / 24)

    if (dias > 0) {
      return `Hace ${dias} día${dias > 1 ? "s" : ""}`
    } else if (horas > 0) {
      return `Hace ${horas} hora${horas > 1 ? "s" : ""}`
    } else {
      return "Hace menos de 1 hora"
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.id}>{incidencia.id}</Text>
          <View style={styles.tipoContainer}>
            <Ionicons name="document-text" size={12} color="#666" />
            <Text style={styles.tipo}>{getTipoTexto(incidencia.tipoIncidencia)}</Text>
          </View>
        </View>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(incidencia.estado) }]}>
          <Text style={styles.estadoText}>{getEstadoTexto(incidencia.estado)}</Text>
        </View>
      </View>

      <Text style={styles.descripcion} numberOfLines={2}>
        {incidencia.descripcion}
      </Text>

      <View style={styles.footer}>
        <View style={styles.prioridadContainer}>
          <Ionicons name="flag" size={12} color={getPrioridadColor(incidencia.prioridad)} />
          <Text style={[styles.prioridad, { color: getPrioridadColor(incidencia.prioridad) }]}>
            {incidencia.prioridad.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.fecha}>{formatearFecha(incidencia.fechaCreacion)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
  },
  id: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  tipoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipo: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  estadoText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  descripcion: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prioridadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prioridad: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  fecha: {
    fontSize: 11,
    color: "#999",
  },
})

export default RecentIncidenciaCard
