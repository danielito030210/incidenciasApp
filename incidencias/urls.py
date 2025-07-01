from django.urls import path
from . import views

app_name = 'incidencias'

urlpatterns = [
    # Autenticación
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Incidencias
    path('incidencias/', views.IncidenciaListCreateView.as_view(), name='incidencia-list-create'),
    path('incidencias/<str:pk>/', views.IncidenciaDetailView.as_view(), name='incidencia-detail'),
    path('incidencias/<str:incidencia_id>/cambiar-estado/', views.cambiar_estado_incidencia, name='cambiar-estado'),
    path('incidencias/<str:incidencia_id>/agregar-comentario/', views.agregar_comentario_admin, name='agregar-comentario'),
    
    # Estadísticas
    path('estadisticas/', views.estadisticas_dashboard, name='estadisticas'),
    
    # Usuarios (solo administradores)
    path('usuarios/', views.UsuarioListCreateView.as_view(), name='usuario-list-create'),
    path('usuarios/<int:pk>/', views.UsuarioDetailView.as_view(), name='usuario-detail'),
    path('usuarios/<int:usuario_id>/cambiar-estado/', views.cambiar_estado_usuario, name='cambiar-estado-usuario'),
    path('usuarios/<int:usuario_id>/restablecer-password/', views.restablecer_password, name='restablecer-password'),
    
    # Reportes
    path('reportes/', views.reporte_incidencias, name='reporte-incidencias'),
]
