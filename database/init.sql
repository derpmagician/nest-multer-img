-- Script para crear la base de datos y configuración inicial
-- Ejecutar como superusuario de PostgreSQL

-- Crear la base de datos (solo si no existe)
-- Nota: Este comando se omite en el script automatizado
-- CREATE DATABASE nestjs_multer
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    country VARCHAR(50),
    newsletter_subscription BOOLEAN DEFAULT FALSE,
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Crear función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt rounds=10)
INSERT INTO users (
    first_name, 
    last_name, 
    email, 
    username, 
    password, 
    country, 
    newsletter_subscription, 
    terms_accepted
) VALUES (
    'Admin',
    'System',
    'admin@nestjs-multer.com',
    'admin',
    '$2b$10$K8BmQz1QoJ6Jx.5Z5H4s2eY5A1Qz6H8jA.QoJ6Jx5Z5H4s2eY5A1Q',
    'US',
    false,
    true
) ON CONFLICT (email) DO NOTHING;

-- Comentarios de documentación
COMMENT ON TABLE users IS 'Tabla de usuarios registrados en el sistema';
COMMENT ON COLUMN users.id IS 'Identificador único del usuario';
COMMENT ON COLUMN users.email IS 'Correo electrónico único del usuario';
COMMENT ON COLUMN users.username IS 'Nombre de usuario único';
COMMENT ON COLUMN users.password IS 'Contraseña hasheada con bcrypt';
COMMENT ON COLUMN users.newsletter_subscription IS 'Suscripción a newsletter';
COMMENT ON COLUMN users.terms_accepted IS 'Aceptación de términos y condiciones';

-- Verificación final
SELECT 'Base de datos nestjs_multer configurada exitosamente' as status;
SELECT 'Tabla users creada con ' || COUNT(*) || ' registros' as table_status FROM users;