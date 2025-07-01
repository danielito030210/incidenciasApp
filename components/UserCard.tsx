import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { Usuario } from "../context/UsuariosContext"

interface UserCardProps {
  usuario: Usuario
  onResetPassword: (id: string) => void
  onDeleteUser: (id: string) => void
  onToggleStatus: (id: string, estado: "activo" | "inactivo") => void
}

const UserCard: React.FC<UserCardProps> = ({ usuario, onResetPassword, onDeleteUser, onToggleStatus }) => {
  const getRolColor = (rol: string) => {
    return rol === "administrador" ? "#9C27B0" : "#2196F3"
  }

  const getRolText = (rol: string) => {
    return rol === "administrador" ? "Administrador" : "Trabajador"
  }

  const getEstadoColor = (estado: string) => {
    return estado === "activo" ? "#4CAF50" : "#F44336"
  }

  const getEstadoText = (estado: string) => {
    return estado === "activo" ? "Activo" : "Inactivo"
  }

  const formatearFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatearUltimoAcceso = (fecha?: Date) => {
    if (!fecha) return "Nunca"

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

  const handleResetPassword = () => {
    Alert.alert(
      "Restablecer Contraseña",
      `¿Estás seguro de que quieres restablecer la contraseña de ${usuario.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Restablecer",
          onPress: () => {
            onResetPassword(usuario.id)
            Alert.alert("Éxito", "Se ha enviado un correo con la nueva contraseña temporal.")
          },
        },
      ],
    )
  }

  const handleDeleteUser = () => {
    Alert.alert(
      "Eliminar Usuario",
      `¿Estás seguro de que quieres eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            onDeleteUser(usuario.id)
            Alert.alert("Usuario eliminado", "El usuario ha sido eliminado exitosamente.")
          },
        },
      ],
    )
  }

  const handleToggleStatus = () => {
    const nuevoEstado = usuario.estado === "activo" ? "inactivo" : "activo"
    const accion = nuevoEstado === "activo" ? "activar" : "desactivar"

    Alert.alert(
      `${accion.charAt(0).toUpperCase() + accion.slice(1)} Usuario`,
      `¿Estás seguro de que quieres ${accion} a ${usuario.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: accion.charAt(0).toUpperCase() + accion.slice(1),
          onPress: () => {
            onToggleStatus(usuario.id, nuevoEstado)
            Alert.alert("Éxito", `Usuario ${nuevoEstado === "activo" ? "activado" : "desactivado"} correctamente.`)
          },
        },
      ],
    )
  }

  return (
    <View style={styles.card}>
      {/* Información Principal */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="white" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.email}>{usuario.email}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: getRolColor(usuario.rol) }]}>
              <Text style={styles.badgeText}>{getRolText(usuario.rol)}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: getEstadoColor(usuario.estado) }]}>
              <Text style={styles.badgeText}>{getEstadoText(usuario.estado)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Información Adicional */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={14} color="#666" />
          <Text style={styles.detailText}>Creado: {formatearFecha(usuario.fechaCreacion)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.detailText}>Último acceso: {formatearUltimoAcceso(usuario.ultimoAcceso)}</Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.toggleButton]} onPress={handleToggleStatus}>
          <Ionicons
            name={usuario.estado === "activo" ? "pause" : "play"}
            size={16}
            color={usuario.estado === "activo" ? "#FF9800" : "#4CAF50"}
          />
          <Text style={[styles.actionText, { color: usuario.estado === "activo" ? "#FF9800" : "#4CAF50" }]}>
            {usuario.estado === "activo" ? "Desactivar" : "Activar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={handleResetPassword}>
          <Ionicons name="key" size={16} color="#2196F3" />
          <Text style={[styles.actionText, { color: "#2196F3" }]}>Restablecer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDeleteUser}>
          <Ionicons name="trash" size={16} color="#F44336" />
          <Text style={[styles.actionText, { color: "#F44336" }]}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
  },
  details: {
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: "#f8f9fa",
  },
  toggleButton: {
    borderColor: "#e9ecef",
  },
  resetButton: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
  },
  deleteButton: {
    borderColor: "#F44336",
    backgroundColor: "#ffebee",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
})

export default UserCard
