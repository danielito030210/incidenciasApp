"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, View, Text, StyleSheet, Platform, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "../context/NavigationContext"
import { useUsuarios } from "../context/UsuariosContext"

// Componentes
import SectionHeader from "../components/SectionHeader"
import UserCard from "../components/UserCard"
import AdminStatCard from "../components/AdminStatCard"

const GestionUsuarios: React.FC = () => {
  const { navigate } = useNavigation()
  const { usuarios, buscarUsuarios, eliminarUsuario, restablecerPassword, cambiarEstadoUsuario, obtenerEstadisticas } =
    useUsuarios()

  const [searchTerm, setSearchTerm] = useState("")

  const estadisticas = obtenerEstadisticas()
  const usuariosFiltrados = searchTerm ? buscarUsuarios(searchTerm) : usuarios

  const volverAlDashboard = () => {
    navigate("Dashboard")
  }

  const irACrearUsuario = () => {
    navigate("CrearUsuario")
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={volverAlDashboard}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Usuarios</Text>
        <TouchableOpacity style={styles.addButton} onPress={irACrearUsuario}>
          <Ionicons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estadísticas */}
        <View style={styles.section}>
          <SectionHeader title="Resumen" subtitle="Estadísticas generales de usuarios" />

          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AdminStatCard title="Total" value={estadisticas.total} icon="people" color="#2196F3" />
              </View>
              <View style={styles.statItem}>
                <AdminStatCard title="Activos" value={estadisticas.activos} icon="checkmark-circle" color="#4CAF50" />
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <AdminStatCard
                  title="Administradores"
                  value={estadisticas.administradores}
                  icon="shield-checkmark"
                  color="#9C27B0"
                />
              </View>
              <View style={styles.statItem}>
                <AdminStatCard title="Trabajadores" value={estadisticas.trabajadores} icon="person" color="#FF9800" />
              </View>
            </View>
          </View>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.section}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={() => setSearchTerm("")}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Botón Crear Usuario */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.createUserButton} onPress={irACrearUsuario}>
            <Ionicons name="person-add" size={24} color="white" />
            <Text style={styles.createUserButtonText}>Crear Nuevo Usuario</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Usuarios */}
        <View style={styles.section}>
          <SectionHeader
            title="Usuarios"
            subtitle={`${usuariosFiltrados.length} usuario${usuariosFiltrados.length !== 1 ? "s" : ""} ${
              searchTerm
                ? "encontrado" + (usuariosFiltrados.length !== 1 ? "s" : "")
                : "registrado" + (usuariosFiltrados.length !== 1 ? "s" : "")
            }`}
          />

          {usuariosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>
                {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Crea el primer usuario para comenzar"}
              </Text>
            </View>
          ) : (
            usuariosFiltrados.map((usuario) => (
              <UserCard
                key={usuario.id}
                usuario={usuario}
                onResetPassword={restablecerPassword}
                onDeleteUser={eliminarUsuario}
                onToggleStatus={cambiarEstadoUsuario}
              />
            ))
          )}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  createUserButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createUserButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    paddingHorizontal: 20,
  },
  bottomSpacing: {
    height: 20,
  },
})

export default GestionUsuarios
