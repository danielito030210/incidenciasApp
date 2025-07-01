"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CambioEstado {
  id: string
  estadoAnterior: "pendiente" | "enProceso" | "resuelto" | null
  estadoNuevo: "pendiente" | "enProceso" | "resuelto"
  fecha: Date
  comentario?: string
  usuario?: string
}

export interface ComentarioAdmin {
  id: string
  mensaje: string
  fecha: Date
  usuario: string
  esVisible: boolean
}

export interface Incidencia {
  id: string
  tipoIncidencia: string
  descripcion: string
  prioridad: string
  ubicacion: string
  imagen: { uri: string; name: string } | null
  estado: "pendiente" | "enProceso" | "resuelto"
  fechaCreacion: Date
  fechaActualizacion: Date
  historialCambios: CambioEstado[]
  comentariosAdmin: ComentarioAdmin[]
  usuarioCreador?: string
}

interface IncidenciasContextType {
  incidencias: Incidencia[]
  incidenciaSeleccionada: Incidencia | null
  loading: boolean
  agregarIncidencia: (
    incidencia: Omit<
      Incidencia,
      "id" | "estado" | "fechaCreacion" | "fechaActualizacion" | "historialCambios" | "comentariosAdmin"
    >,
  ) => Promise<void>
  actualizarEstadoIncidencia: (
    id: string,
    nuevoEstado: Incidencia["estado"],
    comentario?: string,
    usuario?: string,
  ) => Promise<void>
  agregarComentarioAdmin: (id: string, mensaje: string, usuario: string, esVisible?: boolean) => Promise<void>
  seleccionarIncidencia: (id: string) => void
  cargarIncidencias: () => Promise<void>
  obtenerEstadisticas: () => { total: number; pendiente: number; enProceso: number; resuelto: number }
  obtenerIncidenciasPorEstado: (estado: Incidencia["estado"]) => Incidencia[]
}

const IncidenciasContext = createContext<IncidenciasContextType | undefined>(undefined)

export const useIncidencias = () => {
  const context = useContext(IncidenciasContext)
  if (!context) {
    throw new Error("useIncidencias debe ser usado dentro de IncidenciasProvider")
  }
  return context
}

interface IncidenciasProviderProps {
  children: ReactNode
}

export const IncidenciasProvider: React.FC<IncidenciasProviderProps> = ({ children }) => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([])
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia | null>(null)
  const [loading, setLoading] = useState(false)

  const cargarIncidencias = async () => {
    setLoading(true)
    try {
      console.log("Cargando incidencias desde API...")
      setIncidencias([])
    } catch (error) {
      console.error("Error cargando incidencias:", error)
    } finally {
      setLoading(false)
    }
  }

  const agregarIncidencia = async (
    nuevaIncidencia: Omit<
      Incidencia,
      "id" | "estado" | "fechaCreacion" | "fechaActualizacion" | "historialCambios" | "comentariosAdmin"
    >,
  ) => {
    try {
      console.log("Creando incidencia:", nuevaIncidencia)
      const fechaCreacion = new Date()
      const incidencia: Incidencia = {
        ...nuevaIncidencia,
        id: `INC-${Date.now()}`,
        estado: "pendiente",
        fechaCreacion,
        fechaActualizacion: fechaCreacion,
        historialCambios: [],
        comentariosAdmin: [],
      }
      setIncidencias((prev) => [incidencia, ...prev])
    } catch (error) {
      console.error("Error creando incidencia:", error)
      throw error
    }
  }

  const actualizarEstadoIncidencia = async (
    id: string,
    nuevoEstado: Incidencia["estado"],
    comentario?: string,
    usuario?: string,
  ) => {
    try {
      console.log("Actualizando estado incidencia:", { id, nuevoEstado, comentario, usuario })
      setIncidencias((prev) =>
        prev.map((incidencia) => {
          if (incidencia.id === id) {
            const nuevoCambio: CambioEstado = {
              id: `cambio-${Date.now()}`,
              estadoAnterior: incidencia.estado,
              estadoNuevo: nuevoEstado,
              fecha: new Date(),
              comentario: comentario || `Estado cambiado a ${nuevoEstado}`,
              usuario: usuario || "Sistema",
            }

            const incidenciaActualizada = {
              ...incidencia,
              estado: nuevoEstado,
              fechaActualizacion: new Date(),
              historialCambios: [...incidencia.historialCambios, nuevoCambio],
            }

            if (incidenciaSeleccionada?.id === id) {
              setIncidenciaSeleccionada(incidenciaActualizada)
            }

            return incidenciaActualizada
          }
          return incidencia
        }),
      )
    } catch (error) {
      console.error("Error actualizando estado:", error)
      throw error
    }
  }

  const agregarComentarioAdmin = async (id: string, mensaje: string, usuario: string, esVisible = true) => {
    try {
      console.log("Agregando comentario:", { id, mensaje, usuario, esVisible })
      setIncidencias((prev) =>
        prev.map((incidencia) => {
          if (incidencia.id === id) {
            const nuevoComentario: ComentarioAdmin = {
              id: `com-${Date.now()}`,
              mensaje,
              fecha: new Date(),
              usuario,
              esVisible,
            }

            const incidenciaActualizada = {
              ...incidencia,
              comentariosAdmin: [...incidencia.comentariosAdmin, nuevoComentario],
              fechaActualizacion: new Date(),
            }

            if (incidenciaSeleccionada?.id === id) {
              setIncidenciaSeleccionada(incidenciaActualizada)
            }

            return incidenciaActualizada
          }
          return incidencia
        }),
      )
    } catch (error) {
      console.error("Error agregando comentario:", error)
      throw error
    }
  }

  const seleccionarIncidencia = (id: string) => {
    const incidencia = incidencias.find((inc) => inc.id === id)
    setIncidenciaSeleccionada(incidencia || null)
  }

  const obtenerEstadisticas = () => {
    const total = incidencias.length
    const pendiente = incidencias.filter((i) => i.estado === "pendiente").length
    const enProceso = incidencias.filter((i) => i.estado === "enProceso").length
    const resuelto = incidencias.filter((i) => i.estado === "resuelto").length

    return { total, pendiente, enProceso, resuelto }
  }

  const obtenerIncidenciasPorEstado = (estado: Incidencia["estado"]) => {
    return incidencias.filter((incidencia) => incidencia.estado === estado)
  }

  useEffect(() => {
    cargarIncidencias()
  }, [])

  return (
    <IncidenciasContext.Provider
      value={{
        incidencias,
        incidenciaSeleccionada,
        loading,
        agregarIncidencia,
        actualizarEstadoIncidencia,
        agregarComentarioAdmin,
        seleccionarIncidencia,
        cargarIncidencias,
        obtenerEstadisticas,
        obtenerIncidenciasPorEstado,
      }}
    >
      {children}
    </IncidenciasContext.Provider>
  )
}
