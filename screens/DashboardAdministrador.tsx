"use client"

import type React from "react"
import { ScrollView, View, StyleSheet, RefreshControl, useState, Alert } from "react-native"

// Componentes
import WelcomeHeader from "../components/WelcomeHeader"
import SectionHeader from "../components/SectionHeader"
import AdminStatCard from "../components/AdminStatCard"
import AdminActionCard from "../components/AdminActionCard"

// Context
import { useIncidencias } from "../context/IncidenciasContext"
import { useNavigation } from "../context/NavigationContext"
import { useAuth } from "../context/AuthContext"

const DashboardAdministrador: React.FC<{ userName: string }> = ({ userName }) => {
  const { incidencias, obtenerEstadisticas } = useIncidencias()
  const { navigate } = useNavigation()
  const [refreshing, setRefreshing] = useState(false)
  const { logout } = useAuth()

  const estadisticas = obtenerEstadisticas()
  const incidenciasPendientes = incidencias.filter((inc) => inc.estado === "pendiente").length

  const onRefresh = async () => {
    setRefreshing(true)
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const verIncidenciasPorEstado = (estado: "pendiente" | "enProceso" | "resuelto" | "todos") => {
    navigate("HistorialIncidenciasAdmin", { filtroEstado: estado })
  }

  const verTodasLasIncidencias = () => {
    navigate("HistorialIncidenciasAdmin", { filtroEstado: "todos" })
  }

  const verEstadisticasCompletas = () => {
    Alert.alert(
      "Estadísticas Completas",
      "Esta funcionalidad mostraría gráficos detallados, tiempos promedio de resolución, tendencias, etc.",
      [{ text: "OK" }],
    )
  }

  const exportarReportes = () => {
    navigate("ExportarReportes")
  }

  const gestionarUsuarios = () => {
    navigate("GestionUsuarios")
  }

  const cerrarSesion = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: () => {
          logout()
          navigate("Login")
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <WelcomeHeader userName={`${userName} (Admin)`} onLogout={cerrarSesion} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Resumen de Estadísticas */}
        <View style={styles.section}>
          <SectionHeader title="Panel de Control" subtitle="Resumen general del sistema" />

          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AdminStatCard
                  title="Total"
                  value={estadisticas.total}
                  icon="document-text"
                  color="#2196F3"
                  onPress={() => verIncidenciasPorEstado("todos")}
                />
              </View>
              <View style={styles.statItem}>
                <AdminStatCard
                  title="Pendientes"
                  value={estadisticas.pendiente}
                  icon="time"
                  color="#FF9800"
                  backgroundColor="#FFF3E0"
                  onPress={() => verIncidenciasPorEstado("pendiente")}
                />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AdminStatCard
                  title="En Proceso"
                  value={estadisticas.enProceso}
                  icon="sync"
                  color="#2196F3"
                  backgroundColor="#E3F2FD"
                  onPress={() => verIncidenciasPorEstado("enProceso")}
                />
              </View>
              <View style={styles.statItem}>
                <AdminStatCard
                  title="Resueltos"
                  value={estadisticas.resuelto}
                  icon="checkmark-circle"
                  color="#4CAF50"
                  backgroundColor="#E8F5E8"
                  onPress={() => verIncidenciasPorEstado("resuelto")}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Acciones de Administrador */}
        <View style={styles.section}>
          <SectionHeader title="Herramientas de Administración" subtitle="Gestión y control del sistema" />

          <AdminActionCard
            title="Ver Todas las Incidencias"
            subtitle="Gestionar y filtrar todas las incidencias"
            icon="list"
            color="#2196F3"
            onPress={verTodasLasIncidencias}
            badge={incidenciasPendientes}
          />

          <AdminActionCard
            title="Gestión de Usuarios"
            subtitle="Administrar usuarios y permisos"
            icon="people"
            color="#607D8B"
            onPress={gestionarUsuarios}
          />

          <AdminActionCard
            title="Estadísticas Completas"
            subtitle="Gráficos, tendencias y análisis detallado"
            icon="analytics"
            color="#9C27B0"
            onPress={verEstadisticasCompletas}
          />

          <AdminActionCard
            title="Exportar Reportes"
            subtitle="Generar reportes en PDF, Excel o Word"
            icon="download"
            color="#FF5722"
            onPress={exportarReportes}
          />
        </View>

        {/* Espaciado inferior */}
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
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  statsGrid: {
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default DashboardAdministrador
