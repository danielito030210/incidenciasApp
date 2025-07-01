from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.db.models import Q, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Incidencia, CambioEstado, ComentarioAdmin
from usuarios.models import Usuario
from .serializers import (
    IncidenciaSerializer, IncidenciaCreateSerializer, LoginSerializer,
    CambiarEstadoSerializer, AgregarComentarioSerializer, EstadisticasSerializer,
    UsuarioSerializer, UsuarioCreateSerializer
)

# ==================== AUTENTICACIÓN ====================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Vista para el login de usuarios"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Actualizar último acceso
        user.ultimo_acceso = timezone.now()
        user.save()
        
        # Crear o obtener token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Login exitoso',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'nombre_completo': user.nombre_completo,
                'email': user.email,
                'tipo_usuario': user.tipo_usuario,
                'estado': user.estado
            }
        })
    
    return Response({
        'success': False,
        'message': 'Credenciales inválidas',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Vista para el logout de usuarios"""
    try:
        # Eliminar el token del usuario
        request.user.auth_token.delete()
        return Response({
            'success': True,
            'message': 'Logout exitoso'
        })
    except:
        return Response({
            'success': False,
            'message': 'Error al cerrar sesión'
        }, status=status.HTTP_400_BAD_REQUEST)

# ==================== INCIDENCIAS ====================

class IncidenciaListCreateView(generics.ListCreateAPIView):
    """Vista para listar y crear incidencias"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return IncidenciaCreateSerializer
        return IncidenciaSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Incidencia.objects.all().order_by('-fecha_creacion')
        
        # Si es trabajador, solo ver sus propias incidencias
        if user.tipo_usuario == 'trabajador':
            queryset = queryset.filter(usuario_creador=user)
        
        # Filtros opcionales
        estado = self.request.query_params.get('estado', None)
        tipo = self.request.query_params.get('tipo', None)
        prioridad = self.request.query_params.get('prioridad', None)
        
        if estado:
            queryset = queryset.filter(estado=estado)
        if tipo:
            queryset = queryset.filter(tipo_incidencia=tipo)
        if prioridad:
            queryset = queryset.filter(prioridad=prioridad)
        
        return queryset
    
    def perform_create(self, serializer):
        # Asignar el usuario creador
        incidencia = serializer.save(usuario_creador=self.request.user)
        
        # Crear el primer cambio de estado
        CambioEstado.objects.create(
            incidencia=incidencia,
            estado_anterior=None,
            estado_nuevo='pendiente',
            comentario='Incidencia creada',
            usuario=self.request.user
        )

class IncidenciaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vista para ver, actualizar y eliminar una incidencia específica"""
    serializer_class = IncidenciaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Incidencia.objects.all()
        
        # Si es trabajador, solo puede ver sus propias incidencias
        if user.tipo_usuario == 'trabajador':
            queryset = queryset.filter(usuario_creador=user)
        
        return queryset

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cambiar_estado_incidencia(request, incidencia_id):
    """Vista para cambiar el estado de una incidencia (solo administradores)"""
    if request.user.tipo_usuario != 'administrador':
        return Response({
            'success': False,
            'message': 'No tienes permisos para realizar esta acción'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        incidencia = Incidencia.objects.get(id=incidencia_id)
    except Incidencia.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Incidencia no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CambiarEstadoSerializer(data=request.data)
    if serializer.is_valid():
        estado_anterior = incidencia.estado
        nuevo_estado = serializer.validated_data['estado']
        comentario = serializer.validated_data.get('comentario', f'Estado cambiado a {nuevo_estado}')
        
        # Actualizar la incidencia
        incidencia.estado = nuevo_estado
        if nuevo_estado == 'resuelto':
            incidencia.fecha_resolucion = timezone.now()
        incidencia.save()
        
        # Crear registro de cambio
        CambioEstado.objects.create(
            incidencia=incidencia,
            estado_anterior=estado_anterior,
            estado_nuevo=nuevo_estado,
            comentario=comentario,
            usuario=request.user
        )
        
        return Response({
            'success': True,
            'message': f'Estado cambiado a {nuevo_estado}',
            'incidencia': IncidenciaSerializer(incidencia).data
        })
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def agregar_comentario_admin(request, incidencia_id):
    """Vista para agregar comentarios del administrador"""
    if request.user.tipo_usuario != 'administrador':
        return Response({
            'success': False,
            'message': 'No tienes permisos para realizar esta acción'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        incidencia = Incidencia.objects.get(id=incidencia_id)
    except Incidencia.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Incidencia no encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AgregarComentarioSerializer(data=request.data)
    if serializer.is_valid():
        ComentarioAdmin.objects.create(
            incidencia=incidencia,
            mensaje=serializer.validated_data['mensaje'],
            usuario=request.user,
            es_visible=serializer.validated_data['es_visible']
        )
        
        return Response({
            'success': True,
            'message': 'Comentario agregado exitosamente',
            'incidencia': IncidenciaSerializer(incidencia).data
        })
    
    return Response({
        'success': False,
        'message': 'Datos inválidos',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

# ==================== ESTADÍSTICAS ====================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def estadisticas_dashboard(request):
    """Vista para obtener estadísticas del dashboard"""
    user = request.user
    
    # Base queryset según el tipo de usuario
    if user.tipo_usuario == 'trabajador':
        queryset = Incidencia.objects.filter(usuario_creador=user)
    else:
        queryset = Incidencia.objects.all()
    
    # Contar por estados
    stats = queryset.aggregate(
        total=Count('id'),
        pendiente=Count('id', filter=Q(estado='pendiente')),
        en_proceso=Count('id', filter=Q(estado='en_proceso')),
        resuelto=Count('id', filter=Q(estado='resuelto'))
    )
    
    serializer = EstadisticasSerializer(stats)
    return Response({
        'success': True,
        'data': serializer.data
    })

# ==================== USUARIOS (Solo Administradores) ====================

class UsuarioListCreateView(generics.ListCreateAPIView):
    """Vista para listar y crear usuarios (solo administradores)"""
    queryset = Usuario.objects.all().order_by('-fecha_creacion')
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UsuarioCreateSerializer
        return UsuarioSerializer
    
    def get_queryset(self):
        if self.request.user.tipo_usuario != 'administrador':
            return Usuario.objects.none()
        
        queryset = Usuario.objects.all().order_by('-fecha_creacion')
        
        # Filtros opcionales
        search = self.request.query_params.get('search', None)
        tipo = self.request.query_params.get('tipo', None)
        estado = self.request.query_params.get('estado', None)
        
        if search:
            queryset = queryset.filter(
                Q(nombre_completo__icontains=search) | 
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        if tipo:
            queryset = queryset.filter(tipo_usuario=tipo)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        if request.user.tipo_usuario != 'administrador':
            return Response({
                'success': False,
                'message': 'No tienes permisos para crear usuarios'
            }, status=status.HTTP_403_FORBIDDEN)
        
        return super().create(request, *args, **kwargs)

class UsuarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Vista para ver, actualizar y eliminar usuarios (solo administradores)"""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.tipo_usuario != 'administrador':
            return Usuario.objects.none()
        return Usuario.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cambiar_estado_usuario(request, usuario_id):
    """Vista para cambiar el estado de un usuario"""
    if request.user.tipo_usuario != 'administrador':
        return Response({
            'success': False,
            'message': 'No tienes permisos para realizar esta acción'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        usuario = Usuario.objects.get(id=usuario_id)
    except Usuario.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Usuario no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    nuevo_estado = request.data.get('estado')
    if nuevo_estado not in ['activo', 'inactivo']:
        return Response({
            'success': False,
            'message': 'Estado inválido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    usuario.estado = nuevo_estado
    usuario.save()
    
    return Response({
        'success': True,
        'message': f'Usuario {nuevo_estado}',
        'usuario': UsuarioSerializer(usuario).data
    })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def restablecer_password(request, usuario_id):
    """Vista para restablecer la contraseña de un usuario"""
    if request.user.tipo_usuario != 'administrador':
        return Response({
            'success': False,
            'message': 'No tienes permisos para realizar esta acción'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        usuario = Usuario.objects.get(id=usuario_id)
    except Usuario.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Usuario no encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Generar nueva contraseña temporal
    nueva_password = f"temp{usuario.id}2024"
    usuario.set_password(nueva_password)
    usuario.save()
    
    return Response({
        'success': True,
        'message': 'Contraseña restablecida',
        'nueva_password': nueva_password
    })

# ==================== REPORTES ====================

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def reporte_incidencias(request):
    """Vista para generar reportes de incidencias"""
    if request.user.tipo_usuario != 'administrador':
        return Response({
            'success': False,
            'message': 'No tienes permisos para generar reportes'
        }, status=status.HTTP_403_FORBIDDEN)
    
    # Obtener parámetros de filtro
    fecha_desde = request.query_params.get('fecha_desde')
    fecha_hasta = request.query_params.get('fecha_hasta')
    estado = request.query_params.get('estado')
    tipo = request.query_params.get('tipo')
    prioridad = request.query_params.get('prioridad')
    
    queryset = Incidencia.objects.all()
    
    # Aplicar filtros
    if fecha_desde:
        try:
            fecha_desde = datetime.strptime(fecha_desde, '%Y-%m-%d').date()
            queryset = queryset.filter(fecha_creacion__date__gte=fecha_desde)
        except ValueError:
            pass
    
    if fecha_hasta:
        try:
            fecha_hasta = datetime.strptime(fecha_hasta, '%Y-%m-%d').date()
            queryset = queryset.filter(fecha_creacion__date__lte=fecha_hasta)
        except ValueError:
            pass
    
    if estado and estado != 'todos':
        queryset = queryset.filter(estado=estado)
    
    if tipo and tipo != 'todos':
        queryset = queryset.filter(tipo_incidencia=tipo)
    
    if prioridad and prioridad != 'todas':
        queryset = queryset.filter(prioridad=prioridad)
    
    # Serializar datos
    incidencias = IncidenciaSerializer(queryset.order_by('-fecha_creacion'), many=True)
    
    # Estadísticas del reporte
    stats = queryset.aggregate(
        total=Count('id'),
        pendiente=Count('id', filter=Q(estado='pendiente')),
        en_proceso=Count('id', filter=Q(estado='en_proceso')),
        resuelto=Count('id', filter=Q(estado='resuelto'))
    )
    
    return Response({
        'success': True,
        'data': {
            'incidencias': incidencias.data,
            'estadisticas': stats,
            'filtros_aplicados': {
                'fecha_desde': fecha_desde,
                'fecha_hasta': fecha_hasta,
                'estado': estado,
                'tipo': tipo,
                'prioridad': prioridad
            }
        }
    })
