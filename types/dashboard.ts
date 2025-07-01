export interface ReportStats {
  total: number
  pendiente: number
  enProceso: number
  resuelto: number
}

export interface DashboardTrabajadorProps {
  userName?: string
  navigation?: any // En una app real, usarías el tipo específico de React Navigation
  reportStats?: ReportStats
}
