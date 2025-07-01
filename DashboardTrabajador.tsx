"use client"

import type React from "react"
import { ScrollView, View, StyleSheet, RefreshControl, useState, Alert } from "react-native"

// Componentes
import WelcomeHeader from "./components/WelcomeHeader"
import SectionHeader from "./components/SectionHeader"
import StatCard from "./components/StatCard"
import NavigationCard from "./components/NavigationCard"
import { useIncidencias } from "./context/IncidenciasContext"
import { useNavigation } from "./context/NavigationContext"
import { useAuth } from "./context/AuthContext"

const DashboardTrabajador: React.FC<{ userName: string }> = ({ userName }) => {
  const { obtenerEstadisticas } = useIncidencias()
  const { navigate, currentScreen } = useNavigation()
  const { logout } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const reportStats = obtenerEstadisticas()

  const onRefresh = async () => {
    setRefreshing(true)
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const navigateToCrearIncidencia = () => {
    console.log("Navegando a CrearIncidencia")
    navigate("CrearIncidencia")
  }

  const navigateToHistorialReportes = () => {
    console.log("Navegando a HistorialIncidencias")
    navigate("HistorialIncidencias")
  }

  const navigateToMiPerfil = () => {
    console.log("Navegando a PerfilTrabajador")
    console.log("Current screen antes:", currentScreen)
    navigate("PerfilTrabajador")
    console.log("Navigate llamado")
  }

  const navigateToAyuda = () => {
    console.log("Navegando a AyudaSoporte")
    navigate("AyudaSoporte")
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

  // Debug: mostrar pantalla actual
  console.log("DashboardTrabajador - Current screen:", currentScreen)

  return (
    <View style={styles.container}>
      <WelcomeHeader userName={userName} onLogout={cerrarSesion} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Resumen de Incidencias */}
        <View style={styles.section}>
          <SectionHeader title="Resumen de Incidencias" subtitle="Estado actual de tus incidencias" />

          <StatCard title="Total de Incidencias" value={reportStats.total} icon="document-text" color="#2196F3" />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <StatCard
                title="Pendientes"
                value={reportStats.pendiente}
                icon="time"
                color="#FF9800"
                backgroundColor="#FFF3E0"
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="En Proceso"
                value={reportStats.enProceso}
                icon="sync"
                color="#2196F3"
                backgroundColor="#E3F2FD"
              />
            </View>
          </View>

          <StatCard
            title="Resueltos"
            value={reportStats.resuelto}
            icon="checkmark-circle"
            color="#4CAF50"
            backgroundColor="#E8F5E8"
          />
        </View>

        {/* Acciones Principales */}
        <View style={styles.section}>
          <SectionHeader title="Acciones Rápidas" subtitle="Gestiona tus incidencias" />

          <NavigationCard
            title="Crear Nueva Incidencia"
            subtitle="Reporta una nueva incidencia técnica"
            icon="add-circle"
            color="#4CAF50"
            onPress={navigateToCrearIncidencia}
          />

          <NavigationCard
            title="Mis Incidencias"
            subtitle="Ver historial y estado de incidencias"
            icon="list"
            color="#2196F3"
            onPress={navigateToHistorialReportes}
          />
        </View>

        {/* Opciones Adicionales */}
        <View style={styles.section}>
          <SectionHeader title="Más Opciones" />

          <NavigationCard
            title="Mi Perfil"
            subtitle="Configurar información personal"
            icon="person-circle"
            color="#9C27B0"
            onPress={navigateToMiPerfil}
          />

          <NavigationCard
            title="Ayuda y Soporte"
            subtitle="Obtener ayuda y contactar soporte"
            icon="help-circle"
            color="#FF5722"
            onPress={navigateToAyuda}
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
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    marginRight: 6,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default DashboardTrabajador
