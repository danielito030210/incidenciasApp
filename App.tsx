"use client"

import type React from "react"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { IncidenciasProvider } from "./context/IncidenciasContext"
import { UsuariosProvider } from "./context/UsuariosContext"
import { NavigationProvider, useNavigation } from "./context/NavigationContext"
import Login from "./screens/Login"
import DashboardTrabajador from "./DashboardTrabajador"
import DashboardAdministrador from "./screens/DashboardAdministrador"
import CrearIncidencia from "./CrearIncidencia"
import HistorialIncidencias from "./screens/HistorialIncidencias"
import HistorialIncidenciasAdmin from "./screens/HistorialIncidenciasAdmin"
import DetalleIncidencia from "./screens/DetalleIncidencia"
import PerfilTrabajador from "./screens/PerfilTrabajador"
import AyudaSoporte from "./screens/AyudaSoporte"
import GestionUsuarios from "./screens/GestionUsuarios"
import CrearUsuario from "./screens/CrearUsuario"
import ExportarReportes from "./screens/ExportarReportes"

const AppContent: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth()
  const { currentScreen, navigationState, navigate } = useNavigation()

  const handleLogin = (usuario: string, contraseña: string, tipoUsuario: "trabajador" | "administrador") => {
    console.log("🚀 App - handleLogin llamado con:", { usuario, contraseña, tipoUsuario })
    login(usuario, contraseña, tipoUsuario)
    navigate("Dashboard")
  }

  const handleForgotPassword = () => {
    console.log("Navegando a recuperar contraseña")
  }

  // Debug: mostrar cambios en el usuario
  useEffect(() => {
    console.log("🔄 App - Usuario cambió:", user)
    if (user) {
      console.log("📋 App - Detalles del usuario:")
      console.log("  - ID:", user.id)
      console.log("  - Usuario:", user.usuario)
      console.log("  - Nombre:", user.nombre)
      console.log("  - Tipo:", user.tipo)
      console.log("  - Email:", user.email)
    }
  }, [user])

  if (!isAuthenticated) {
    console.log("❌ App - Usuario no autenticado, mostrando Login")
    return <Login onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
  }

  console.log("✅ App - Usuario autenticado")
  console.log("📍 App - Pantalla actual:", currentScreen)
  console.log("👤 App - Tipo de usuario:", user?.tipo)

  const renderScreen = () => {
    console.log("🎬 App - Renderizando pantalla:", currentScreen)

    switch (currentScreen) {
      case "Dashboard":
        console.log("🏠 Renderizando Dashboard")
        console.log("🔍 Verificando tipo de usuario:", user?.tipo)

        if (user?.tipo === "administrador") {
          console.log("👑 Mostrando Dashboard de ADMINISTRADOR")
          return <DashboardAdministrador userName={user?.nombre || "Administrador"} />
        } else if (user?.tipo === "trabajador") {
          console.log("👷 Mostrando Dashboard de TRABAJADOR")
          return <DashboardTrabajador userName={user?.nombre || "Usuario"} />
        } else {
          console.log("❓ Tipo de usuario desconocido:", user?.tipo)
          console.log("🔄 Fallback a Dashboard de Trabajador")
          return <DashboardTrabajador userName={user?.nombre || "Usuario"} />
        }

      case "CrearIncidencia":
        console.log("📝 Renderizando CrearIncidencia")
        return <CrearIncidencia />

      case "HistorialIncidencias":
        console.log("📋 Renderizando HistorialIncidencias")
        return <HistorialIncidencias />

      case "HistorialIncidenciasAdmin":
        console.log("📋 Renderizando HistorialIncidenciasAdmin")
        return <HistorialIncidenciasAdmin filtroEstado={navigationState.filtroEstado} />

      case "DetalleIncidencia":
        console.log("🔍 Renderizando DetalleIncidencia")
        return <DetalleIncidencia />

      case "PerfilTrabajador":
        console.log("👤 Renderizando PerfilTrabajador")
        return <PerfilTrabajador />

      case "AyudaSoporte":
        console.log("❓ Renderizando AyudaSoporte")
        return <AyudaSoporte />

      case "GestionUsuarios":
        console.log("👥 Renderizando GestionUsuarios")
        return <GestionUsuarios />

      case "CrearUsuario":
        console.log("➕ Renderizando CrearUsuario")
        return <CrearUsuario />

      case "ExportarReportes":
        console.log("📊 Renderizando ExportarReportes")
        return <ExportarReportes />

      default:
        console.log("🔄 Renderizando default (Dashboard)")
        console.log("🔍 Verificando tipo de usuario en default:", user?.tipo)

        if (user?.tipo === "administrador") {
          console.log("👑 Default: Mostrando Dashboard de ADMINISTRADOR")
          return <DashboardAdministrador userName={user?.nombre || "Administrador"} />
        } else {
          console.log("👷 Default: Mostrando Dashboard de TRABAJADOR")
          return <DashboardTrabajador userName={user?.nombre || "Usuario"} />
        }
    }
  }

  return renderScreen()
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IncidenciasProvider>
        <UsuariosProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </UsuariosProvider>
      </IncidenciasProvider>
    </AuthProvider>
  )
}

export default App
