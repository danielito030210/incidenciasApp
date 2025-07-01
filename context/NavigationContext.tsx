"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

type Screen =
  | "Login"
  | "Dashboard"
  | "CrearIncidencia"
  | "HistorialIncidencias"
  | "HistorialIncidenciasAdmin"
  | "DetalleIncidencia"
  | "PerfilTrabajador"
  | "AyudaSoporte"
  | "GestionUsuarios"
  | "CrearUsuario"
  | "ExportarReportes"
  | "ForgotPassword"

interface NavigationState {
  filtroEstado?: "pendiente" | "enProceso" | "resuelto" | "todos"
}

interface NavigationContextType {
  currentScreen: Screen
  navigationState: NavigationState
  navigate: (screen: Screen, state?: NavigationState) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation debe ser usado dentro de NavigationProvider")
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("Login")
  const [navigationState, setNavigationState] = useState<NavigationState>({})

  const navigate = (screen: Screen, state?: NavigationState) => {
    setCurrentScreen(screen)
    setNavigationState(state || {})
  }

  return (
    <NavigationContext.Provider value={{ currentScreen, navigationState, navigate }}>
      {children}
    </NavigationContext.Provider>
  )
}
