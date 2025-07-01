"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  usuario: string
  nombre: string
  tipo: "trabajador" | "administrador"
  email?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (usuario: string, contraseña: string, tipoUsuario: "trabajador" | "administrador") => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (usuario: string, contraseña: string, tipoUsuario: "trabajador" | "administrador") => {
    setLoading(true)
    try {
      // TODO: Llamar a API de autenticación aquí
      // Ejemplo: const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ usuario, contraseña, tipoUsuario })
      // })
      // const userData = await response.json()

      // TODO: Validar respuesta del servidor
      // if (!response.ok) {
      //   throw new Error(userData.message || 'Error de autenticación')
      // }

      // TODO: Guardar token en localStorage/sessionStorage si es necesario
      // localStorage.setItem('authToken', userData.token)

      // TODO: Establecer usuario desde respuesta del servidor
      // setUser(userData.user)

      console.log("🔐 AuthContext - login llamado con:", { usuario, contraseña, tipoUsuario })

      // TEMPORAL: Simulación hasta conectar API real
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: Date.now().toString(),
        usuario,
        nombre: tipoUsuario === "administrador" ? "Administrador Sistema" : "Usuario",
        tipo: tipoUsuario,
        email: tipoUsuario === "administrador" ? "admin@empresa.com" : "usuario@empresa.com",
      }

      setUser(userData)
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // TODO: Llamar a API de logout si es necesario
    // Ejemplo: await fetch('/api/auth/logout', { method: 'POST' })

    // TODO: Limpiar token del almacenamiento
    // localStorage.removeItem('authToken')

    console.log("🚪 AuthContext - logout llamado")
    setUser(null)
  }

  // TODO: Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      // const token = localStorage.getItem('authToken')
      // if (token) {
      //   try {
      //     const response = await fetch('/api/auth/verify', {
      //       headers: { 'Authorization': `Bearer ${token}` }
      //     })
      //     if (response.ok) {
      //       const userData = await response.json()
      //       setUser(userData.user)
      //     } else {
      //       localStorage.removeItem('authToken')
      //     }
      //   } catch (error) {
      //     console.error('Error verificando token:', error)
      //     localStorage.removeItem('authToken')
      //   }
      // }
    }

    checkAuthStatus()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
