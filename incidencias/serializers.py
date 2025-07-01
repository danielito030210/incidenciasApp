from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Incidencia, CambioEstado, ComentarioAdmin
from usuarios.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Usuario"""
    
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'nombre_completo', 'email', 'tipo_usuario', 'estado', 'fecha_creacion', 'ultimo_acceso']
        read_only_fields = ['id', 'fecha_creacion', 'ultimo_acceso']

class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear usuarios"""
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['username', 'nombre_completo', 'email', 'password', 'confirm_password', 'tipo_usuario', 'estado']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        usuario = Usuario.objects.create_user(**validated_data)
        usuario.set_password(password)
        usuario.save()
        return usuario

class CambioEstadoSerializer(serializers.ModelSerializer):
    """Serializer para el historial de cambios de estado"""
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    
    class Meta:
        model = CambioEstado
        fields = ['id', 'estado_anterior', 'estado_nuevo', 'comentario', 'fecha', 'usuario_nombre']

class ComentarioAdminSerializer(serializers.ModelSerializer):
    """Serializer para comentarios del administrador"""
    usuario_nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    
    class Meta:
        model = ComentarioAdmin
        fields = ['id', 'mensaje', 'fecha', 'usuario_nombre', 'es_visible']

class IncidenciaSerializer(serializers.ModelSerializer):
    """Serializer para el modelo Incidencia"""
    usuario_creador_nombre = serializers.CharField(source='usuario_creador.nombre_completo', read_only=True)
    historial_cambios = CambioEstadoSerializer(many=True, read_only=True)
    comentarios_admin = ComentarioAdminSerializer(many=True, read_only=True)
    
    class Meta:
        model = Incidencia
        fields = [
            'id', 'tipo_incidencia', 'descripcion', 'prioridad', 'ubicacion', 
            'estado', 'fecha_creacion', 'fecha_actualizacion', 'fecha_resolucion',
            'usuario_creador', 'usuario_creador_nombre', 'historial_cambios', 
            'comentarios_admin', 'imagen'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_actualizacion', 'fecha_resolucion']

class IncidenciaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear incidencias"""
    
    class Meta:
        model = Incidencia
        fields = ['tipo_incidencia', 'descripcion', 'prioridad', 'ubicacion', 'imagen']
    
    def create(self, validated_data):
        # El usuario creador se asigna en la vista
        return Incidencia.objects.create(**validated_data)

class LoginSerializer(serializers.Serializer):
    """Serializer para el login"""
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales inválidas')
            if not user.is_active:
                raise serializers.ValidationError('Usuario inactivo')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Debe proporcionar username y password')

class CambiarEstadoSerializer(serializers.Serializer):
    """Serializer para cambiar el estado de una incidencia"""
    estado = serializers.ChoiceField(choices=Incidencia.ESTADOS_CHOICES)
    comentario = serializers.CharField(required=False, allow_blank=True)

class AgregarComentarioSerializer(serializers.Serializer):
    """Serializer para agregar comentarios del administrador"""
    mensaje = serializers.CharField(max_length=1000)
    es_visible = serializers.BooleanField(default=True)

class EstadisticasSerializer(serializers.Serializer):
    """Serializer para las estadísticas del dashboard"""
    total = serializers.IntegerField()
    pendiente = serializers.IntegerField()
    en_proceso = serializers.IntegerField()
    resuelto = serializers.IntegerField()
