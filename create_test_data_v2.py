import os
import sys
import django
from django.utils import timezone
from datetime import timedelta
import random

# Agregar el directorio del proyecto al path de Python
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'incidencias_project.settings')

try:
    django.setup()
    print("✅ Django configurado correctamente")
except Exception as e:
    print(f"❌ Error configurando Django: {e}")
    sys.exit(1)

# Importar modelos después de configurar Django
try:
    from usuarios.models import Usuario
    from incidencias.models import Incidencia, CambioEstado, ComentarioAdmin
    print("✅ Modelos importados correctamente")
except ImportError as e:
    print(f"❌ Error importando modelos: {e}")
    sys.exit(1)

def limpiar_datos_existentes():
    """Limpiar datos existentes si el usuario lo desea"""
    print("\n🔍 Verificando datos existentes...")
    
    incidencias_count = Incidencia.objects.count()
    usuarios_count = Usuario.objects.exclude(username='admin').count()
    
    if incidencias_count > 0 or usuarios_count > 0:
        print(f"📊 Datos encontrados:")
        print(f"   - Incidencias: {incidencias_count}")
        print(f"   - Usuarios (sin admin): {usuarios_count}")
        
        respuesta = input("\n¿Deseas eliminar todos los datos existentes y crear nuevos? (s/n): ").lower()
        if respuesta == 's':
            print("🗑️  Eliminando datos existentes...")
            
            # Eliminar en orden correcto para evitar problemas de FK
            ComentarioAdmin.objects.all().delete()
            CambioEstado.objects.all().delete()
            Incidencia.objects.all().delete()
            Usuario.objects.exclude(username='admin').delete()
            
            print("✅ Datos eliminados correctamente")
            return True
        else:
            print("ℹ️  Manteniendo datos existentes")
            return False
    else:
        print("ℹ️  No hay datos existentes")
        return True

def crear_usuarios_prueba():
    """Crear usuarios de prueba"""
    print("\n🔄 Creando usuarios de prueba...")
    
    # Verificar si ya existe el superusuario
    if Usuario.objects.filter(username='admin').exists():
        print("ℹ️  El usuario admin ya existe")
        admin1 = Usuario.objects.get(username='admin')
    else:
        # Crear administrador principal
        admin1 = Usuario.objects.create_user(
            username='admin',
            email='admin@universidad.edu',
            password='admin123',
            nombre_completo='Administrador Sistema',
            tipo_usuario='administrador',
            estado='activo'
        )
        admin1.is_staff = True
        admin1.is_superuser = True
        admin1.save()
        print(f"✅ Creado: {admin1.nombre_completo}")
    
    # Crear segundo administrador
    admin2, created = Usuario.objects.get_or_create(
        username='admin.soporte',
        defaults={
            'nombre_completo': 'María González',
            'email': 'maria.gonzalez@universidad.edu',
            'tipo_usuario': 'administrador',
            'estado': 'activo',
        }
    )
    if created:
        admin2.set_password('admin123')
        admin2.save()
        print(f"✅ Creado: {admin2.nombre_completo}")
    else:
        print(f"ℹ️  Ya existe: {admin2.nombre_completo}")
    
    # Trabajadores
    trabajadores_data = [
        {
            'username': 'juan.perez',
            'nombre_completo': 'Juan Pérez López',
            'email': 'juan.perez@universidad.edu',
        },
        {
            'username': 'ana.martinez',
            'nombre_completo': 'Ana Martínez Silva',
            'email': 'ana.martinez@universidad.edu',
        },
        {
            'username': 'carlos.rodriguez',
            'nombre_completo': 'Carlos Rodríguez Gómez',
            'email': 'carlos.rodriguez@universidad.edu',
        },
        {
            'username': 'lucia.fernandez',
            'nombre_completo': 'Lucía Fernández Torres',
            'email': 'lucia.fernandez@universidad.edu',
        },
        {
            'username': 'miguel.santos',
            'nombre_completo': 'Miguel Santos Ruiz',
            'email': 'miguel.santos@universidad.edu',
        }
    ]
    
    for data in trabajadores_data:
        trabajador, created = Usuario.objects.get_or_create(
            username=data['username'],
            defaults={
                'nombre_completo': data['nombre_completo'],
                'email': data['email'],
                'tipo_usuario': 'trabajador',
                'estado': 'activo',
            }
        )
        if created:
            trabajador.set_password('123456')
            trabajador.save()
            print(f"✅ Creado: {trabajador.nombre_completo}")
        else:
            print(f"ℹ️  Ya existe: {trabajador.nombre_completo}")

def crear_incidencias_prueba():
    """Crear incidencias de prueba"""
    print("\n🔄 Creando incidencias de prueba...")
    
    trabajadores = Usuario.objects.filter(tipo_usuario='trabajador')
    administradores = Usuario.objects.filter(tipo_usuario='administrador')
    
    if not trabajadores.exists():
        print("❌ No hay trabajadores para crear incidencias")
        return
    
    incidencias_data = [
        {
            'tipo_incidencia': 'hardware',
            'descripcion': 'El monitor de mi computadora no enciende. He verificado las conexiones y el problema persiste.',
            'prioridad': 'alta',
            'ubicacion': 'Oficina 205, Edificio A',
            'estado': 'pendiente'
        },
        {
            'tipo_incidencia': 'software',
            'descripcion': 'No puedo acceder al sistema de gestión académica. Me aparece error de conexión.',
            'prioridad': 'media',
            'ubicacion': 'Sala de profesores, Planta 3',
            'estado': 'en_proceso'
        },
        {
            'tipo_incidencia': 'red',
            'descripcion': 'La conexión a internet es muy lenta en toda la oficina. Afecta el trabajo diario.',
            'prioridad': 'alta',
            'ubicacion': 'Departamento de Sistemas',
            'estado': 'pendiente'
        },
        {
            'tipo_incidencia': 'hardware',
            'descripcion': 'La impresora no funciona correctamente. Se atasca el papel constantemente.',
            'prioridad': 'baja',
            'ubicacion': 'Secretaría General',
            'estado': 'resuelto'
        },
        {
            'tipo_incidencia': 'software',
            'descripcion': 'Microsoft Office se cierra inesperadamente al abrir documentos grandes.',
            'prioridad': 'media',
            'ubicacion': 'Oficina 102, Edificio B',
            'estado': 'en_proceso'
        },
        {
            'tipo_incidencia': 'red',
            'descripcion': 'No hay acceso a la red WiFi institucional desde el aula 301.',
            'prioridad': 'alta',
            'ubicacion': 'Aula 301, Edificio C',
            'estado': 'pendiente'
        },
        {
            'tipo_incidencia': 'hardware',
            'descripcion': 'El teclado tiene varias teclas que no funcionan (A, S, Enter).',
            'prioridad': 'media',
            'ubicacion': 'Laboratorio de Informática 1',
            'estado': 'resuelto'
        },
        {
            'tipo_incidencia': 'software',
            'descripcion': 'El antivirus está bloqueando aplicaciones necesarias para el trabajo.',
            'prioridad': 'baja',
            'ubicacion': 'Oficina 150, Edificio A',
            'estado': 'resuelto'
        },
        {
            'tipo_incidencia': 'otro',
            'descripcion': 'Solicitud de instalación de software especializado para diseño gráfico.',
            'prioridad': 'baja',
            'ubicacion': 'Departamento de Diseño',
            'estado': 'pendiente'
        },
        {
            'tipo_incidencia': 'hardware',
            'descripcion': 'La computadora se reinicia sola cada 30 minutos aproximadamente.',
            'prioridad': 'alta',
            'ubicacion': 'Oficina del Director',
            'estado': 'en_proceso'
        }
    ]
    
    for i, data in enumerate(incidencias_data):
        try:
            # Asignar usuario creador aleatorio
            usuario_creador = random.choice(trabajadores)
            
            # Crear fecha aleatoria en los últimos 30 días
            dias_atras = random.randint(1, 30)
            fecha_creacion = timezone.now() - timedelta(days=dias_atras)
            
            # Crear la incidencia sin especificar ID (dejar que Django lo genere)
            incidencia = Incidencia(
                tipo_incidencia=data['tipo_incidencia'],
                descripcion=data['descripcion'],
                prioridad=data['prioridad'],
                ubicacion=data['ubicacion'],
                estado=data['estado'],
                usuario_creador=usuario_creador,
                fecha_creacion=fecha_creacion,
                fecha_resolucion=fecha_creacion + timedelta(days=random.randint(1, 5)) if data['estado'] == 'resuelto' else None
            )
            
            # Guardar la incidencia
            incidencia.save()
            
            # Crear historial de cambios
            CambioEstado.objects.create(
                incidencia=incidencia,
                estado_anterior=None,
                estado_nuevo='pendiente',
                comentario='Incidencia creada',
                usuario=usuario_creador,
                fecha=fecha_creacion
            )
            
            # Si no está pendiente, agregar más cambios
            if data['estado'] != 'pendiente':
                admin = random.choice(administradores) if administradores.exists() else usuario_creador
                
                # Cambio a en_proceso
                fecha_proceso = fecha_creacion + timedelta(hours=random.randint(1, 24))
                CambioEstado.objects.create(
                    incidencia=incidencia,
                    estado_anterior='pendiente',
                    estado_nuevo='en_proceso',
                    comentario='Incidencia tomada en proceso por el equipo técnico',
                    usuario=admin,
                    fecha=fecha_proceso
                )
                
                # Si está resuelto, agregar cambio final
                if data['estado'] == 'resuelto':
                    fecha_resolucion = fecha_proceso + timedelta(hours=random.randint(1, 48))
                    CambioEstado.objects.create(
                        incidencia=incidencia,
                        estado_anterior='en_proceso',
                        estado_nuevo='resuelto',
                        comentario='Problema solucionado exitosamente',
                        usuario=admin,
                        fecha=fecha_resolucion
                    )
                    
                    # Agregar comentario de resolución
                    ComentarioAdmin.objects.create(
                        incidencia=incidencia,
                        mensaje=f'Problema resuelto. Se realizaron las correcciones necesarias.',
                        usuario=admin,
                        es_visible=True,
                        fecha=fecha_resolucion
                    )
            
            print(f"✅ Creada incidencia: {incidencia.id} - {data['tipo_incidencia']}")
            
        except Exception as e:
            print(f"❌ Error creando incidencia {i+1}: {e}")
            continue

def main():
    """Función principal"""
    print("🚀 Creando datos de prueba para el sistema...")
    print("=" * 60)
    
    try:
        # Preguntar si limpiar datos existentes
        continuar = limpiar_datos_existentes()
        
        if continuar:
            crear_usuarios_prueba()
            crear_incidencias_prueba()
            
            print("\n" + "=" * 60)
            print("✅ Datos de prueba creados exitosamente!")
            print("\n📋 Resumen:")
            print(f"👥 Usuarios totales: {Usuario.objects.count()}")
            print(f"👑 Administradores: {Usuario.objects.filter(tipo_usuario='administrador').count()}")
            print(f"👷 Trabajadores: {Usuario.objects.filter(tipo_usuario='trabajador').count()}")
            print(f"📝 Incidencias totales: {Incidencia.objects.count()}")
            print(f"⏳ Pendientes: {Incidencia.objects.filter(estado='pendiente').count()}")
            print(f"🔄 En proceso: {Incidencia.objects.filter(estado='en_proceso').count()}")
            print(f"✅ Resueltas: {Incidencia.objects.filter(estado='resuelto').count()}")
            
            print("\n🔑 Credenciales de acceso:")
            print("👑 Administrador: admin / admin123")
            print("👷 Trabajador: juan.perez / 123456")
            print("👷 Trabajador: ana.martinez / 123456")
        else:
            print("ℹ️  Operación cancelada")
        
    except Exception as e:
        print(f"❌ Error durante la ejecución: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
