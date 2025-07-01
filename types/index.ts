export interface FormData {
  tipoIncidencia: string
  descripcion: string
  prioridad: string
  ubicacion: string
  imagen: ImageData | null
}

export interface ImageData {
  uri: string
  name: string
}

export interface TipoIncidencia {
  label: string
  value: string
}

export interface Prioridad {
  label: string
  value: string
  color: string
}

export interface CrearIncidenciaProps {
  onSubmit?: (formData: FormData) => void
}
