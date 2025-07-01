import type React from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useIncidencias } from "../context/IncidenciasContext"
import { useNavigation } from "../context/NavigationContext"

const HistorialIncidencias: React.FC = () => {
  const { incidencias, seleccionarIncidencia } = useIncidencias()
  const { navigate } = useNavigation()

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

  const verDetalle = (incidenciaId: string) => {
    seleccionarIncidencia(incidenciaId)
    navigate("DetalleIncidencia")
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate("Dashboard")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Incidencias</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {incidencias.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay incidencias</Text>
            <Text style={styles.emptySubtitle}>Aún no has reportado ninguna incidencia</Text>
          </View>
        ) : (
          incidencias.map((incidencia) => (
            <TouchableOpacity
              key={incidencia.id}
              style={styles.incidenciaCard}
              onPress={() => verDetalle(incidencia.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.idContainer}>
                  <Text style={styles.incidenciaId}>{incidencia.id}</Text>
                  <View style={styles.tipoContainer}>
                    <Ionicons name="document-text" size={14} color="#666" />
                    <Text style={styles.tipoText}>{getTipoTexto(incidencia.tipoIncidencia)}</Text>
                  </View>
                </View>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(incidencia.estado) }]}>
                  <Text style={styles.estadoText}>{getEstadoTexto(incidencia.estado)}</Text>
                </View>
              </View>

              <Text style={styles.descripcion} numberOfLines={2}>
                {incidencia.descripcion}
              </Text>

              {/* Comentarios del Administrador */}
              {incidencia.comentariosAdmin && incidencia.comentariosAdmin.length > 0 && (
                <View style={styles.comentariosSection}>
                  <Text style={styles.comentariosTitulo}>Comentarios del Administrador:</Text>
                  {incidencia.comentariosAdmin
                    .filter((comentario) => comentario.esVisible)
                    .slice(-2) // Mostrar solo los últimos 2 comentarios
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

              <View style={styles.detalles}>
                <View style={styles.detalle}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.detalleText}>{incidencia.ubicacion}</Text>
                </View>
                <View style={styles.detalle}>
                  <Ionicons name="flag" size={14} color="#666" />
                  <Text style={styles.detalleText}>Prioridad {incidencia.prioridad}</Text>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.fechaText}>Creado: {formatearFecha(incidencia.fechaCreacion)}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))
        )}

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
  },
  tipoText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  fechaText: {
    fontSize: 12,
    color: "#999",
  },
  bottomSpacing: {
    height: 20,
  },
})

export default HistorialIncidencias
