# NestJS Multer File Upload App

Una aplicación web completa construida con NestJS para la gestión de archivos y usuarios, incluyendo registro de usuarios y subida de archivos con PostgreSQL como base de datos.

## Características

- 📁 **Gestión de Archivos**: Subida y visualización de archivos con validación
- 👥 **Sistema de Usuarios**: Registro completo con validación en tiempo real  
- 🗄️ **Base de Datos**: Integración con PostgreSQL usando TypeORM
- 🎨 **Frontend Moderno**: Interfaz responsive con HTML5, CSS3 y JavaScript
- 🔒 **Seguridad**: Validación de datos y hash de contraseñas con bcrypt
- 📱 **Responsive**: Diseño adaptable para dispositivos móviles

## Tecnologías Utilizadas

- **Backend**: NestJS, TypeORM, Multer
- **Base de Datos**: PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Validación**: class-validator, class-transformer
- **Seguridad**: bcrypt para hash de contraseñas

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install
```

### 2. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y ejecutándose:

```bash
# En Windows con PostgreSQL instalado
psql -U postgres
```

### 3. Configurar variables de entorno

El archivo `.env` ya está configurado con valores por defecto:

```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=nestjs_multer

# Application configuration
PORT=3000
NODE_ENV=development
```

**Importante**: Cambia `DB_PASSWORD` por tu contraseña real de PostgreSQL.

### 4. Configurar la base de datos

Ejecuta el script automatizado para crear la base de datos y las tablas:

```bash
# Configuración automática de la base de datos
npm run db:setup
```

Este script:
- ✅ Crea la base de datos `nestjs_multer` si no existe
- ✅ Ejecuta el script SQL para crear las tablas
- ✅ Crea un usuario administrador por defecto
- ✅ Verifica la conexión

### 5. Verificar la configuración

```bash
# Probar conexión a la base de datos
npm run db:test
```

## Ejecución

### Desarrollo

```bash
# Iniciar en modo desarrollo con hot-reload
npm run start:dev
```

### Producción

```bash
# Compilar y ejecutar
npm run build
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

```
nestjs-multer/
├── src/
│   ├── database/          # Scripts de base de datos
│   │   ├── init.sql      # Script de inicialización SQL
│   │   └── setup.ts      # Configuración automatizada
│   ├── entities/         # Entidades de TypeORM
│   │   └── user.entity.ts
│   ├── users/            # Módulo de usuarios
│   │   ├── dto/          # DTOs de validación
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── app.controller.ts # Controlador de archivos
│   ├── app.module.ts     # Módulo principal
│   └── main.ts           # Punto de entrada
├── public/               # Frontend estático
│   ├── assets/          # CSS y JavaScript
│   ├── index.html       # Página principal
│   ├── register.html    # Página de registro
│   └── files.html       # Gestión de archivos
├── uploads/             # Archivos subidos
└── database/            # Scripts SQL
```

## API Endpoints

### Usuarios
- `POST /users/register` - Registrar nuevo usuario
- `GET /users/check-email/:email` - Verificar disponibilidad de email
- `GET /users/check-username/:username` - Verificar disponibilidad de username

### Archivos
- `POST /upload` - Subir archivo
- `GET /files` - Listar archivos
- `GET /uploads/:filename` - Obtener archivo

## Páginas Web

- **`/`** - Página principal con login
- **`/register.html`** - Formulario de registro de usuarios
- **`/files.html`** - Gestión y visualización de archivos

## Base de Datos

### Tabla Users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    birth_date DATE,
    gender VARCHAR(20),
    country VARCHAR(100),
    notification_email BOOLEAN DEFAULT true,
    notification_sms BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Iniciar en modo desarrollo
npm run build           # Compilar aplicación

# Base de datos
npm run db:setup        # Configurar base de datos completa
npm run db:test         # Probar conexión
npm run db:init         # Ejecutar solo el script SQL

# Testing
npm run test            # Ejecutar tests
npm run test:e2e        # Tests end-to-end

# Calidad de código
npm run lint            # Linting
npm run format          # Formatear código
```

## Usuario Administrador por Defecto

El script de configuración crea un usuario administrador:

- **Email**: admin@nestjs-multer.com
- **Username**: admin
- **Password**: admin123

## Troubleshooting

### Error de conexión a PostgreSQL

1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en el archivo `.env`
3. Asegúrate de que el puerto 5432 esté disponible

### Error "database does not exist"

Ejecuta el script de configuración:
```bash
npm run db:setup
```

### Problemas con permisos de archivos

Asegúrate de que el directorio `uploads/` tenga permisos de escritura.

## Próximas Características

- 🔐 Autenticación JWT
- 👤 Login de usuarios
- 📊 Dashboard de usuarios
- 🔍 Búsqueda de archivos
- 📈 Analytics de uso

## Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
