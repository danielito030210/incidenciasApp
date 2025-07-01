"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "administrador" | "trabajador"
  estado: "activo" | "inactivo"
  fechaCreacion: Date
  ultimoAcceso?: Date
}

interface UsuariosContextType {
  usuarios: Usuario[]
  loading: boolean
  buscarUsuarios: (termino: string) => Usuario[]
  cargarUsuarios: () => Promise<void>
  crearUsuario: (usuario: Omit<Usuario, "id" | "fechaCreacion">) => Promise<void>
  eliminarUsuario: (id: string) => Promise<void>
  restablecerPassword: (id: string) => Promise<void>
  cambiarEstadoUsuario: (id: string, estado: "activo" | "inactivo") => Promise<void>
  obtenerEstadisticas: () => {
    total: number
    administradores: number
    trabajadores: number
    activos: number
    inactivos: number
  }
}

const UsuariosContext = createContext<UsuariosContextType | undefined>(undefined)

export const useUsuarios = () => {
  const context = useContext(UsuariosContext)
  if (!context) {
    throw new Error("useUsuarios debe ser usado dentro de UsuariosProvider")
  }
  return context
}

interface UsuariosProviderProps {
  children: ReactNode
}

export const UsuariosProvider: React.FC<UsuariosProviderProps> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)

  const cargarUsuarios = async () => {
    setLoading(true)
    try {
      console.log("Cargando usuarios desde API...")
      setUsuarios([])
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const buscarUsuarios = (termino: string): Usuario[] => {
    if (!termino.trim()) return usuarios

    const terminoLower = termino.toLowerCase()
    return usuarios.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(terminoLower) || usuario.email.toLowerCase().includes(terminoLower),
    )
  }

  const crearUsuario = async (nuevoUsuario: Omit<Usuario, "id" | "fechaCreacion">) => {
    try {
      console.log("Creando usuario:", nuevoUsuario)
      const usuario: Usuario = {
        ...nuevoUsuario,
        id: `user-${Date.now()}`,
        fechaCreacion: new Date(),
      }
      setUsuarios((prev) => [usuario, ...prev])
    } catch (error) {
      console.error("Error creando usuario:", error)
      throw error
    }
  }

  const eliminarUsuario = async (id: string) => {
    try {
      console.log("Eliminando usuario:", id)
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id))
    } catch (error) {
      console.error("Error eliminando usuario:", error)
      throw error
    }
  }

  const restablecerPassword = async (id: string) => {
    try {
      console.log("Restableciendo contraseña para usuario:", id)
    } catch (error) {
      console.error("Error restableciendo contraseña:", error)
      throw error
    }
  }

  const cambiarEstadoUsuario = async (id: string, estado: "activo" | "inactivo") => {
    try {
      console.log("Cambiando estado usuario:", { id, estado })
      setUsuarios((prev) => prev.map((usuario) => (usuario.id === id ? { ...usuario, estado } : usuario)))
    } catch (error) {
      console.error("Error cambiando estado:", error)
      throw error
    }
  }

  const obtenerEstadisticas = () => {
    const total = usuarios.length
    const administradores = usuarios.filter((u) => u.rol === "administrador").length
    const trabajadores = usuarios.filter((u) => u.rol === "trabajador").length
    const activos = usuarios.filter((u) => u.estado === "activo").length
    const inactivos = usuarios.filter((u) => u.estado === "inactivo").length

    return { total, administradores, trabajadores, activos, inactivos }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        loading,
        buscarUsuarios,
        cargarUsuarios,
        crearUsuario,
        eliminarUsuario,
        restablecerPassword,
        cambiarEstadoUsuario,
        obtenerEstadisticas,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  )
}
