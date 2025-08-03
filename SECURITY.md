# 🔒 Guía de Seguridad - Variables de Entorno

## ⚠️ IMPORTANTE: Configuración Segura

### 1. Configurar Variables de Entorno

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` con tus credenciales reales:**
   ```env
   DB_PASSWORD=TU_CONTRASEÑA_SEGURA_AQUI
   JWT_SECRET=CLAVE_SECRETA_GENERADA
   ```

3. **Genera una clave JWT segura:**
   ```bash
   # En Windows con OpenSSL instalado
   openssl rand -base64 32
   
   # O usa un generador online confiable
   # https://generate-secret.vercel.app/32
   ```

### 2. Contraseñas Seguras

**❌ NO uses estas contraseñas:**
- `123456`
- `password`
- `postgres`
- `admin`

**✅ Usa contraseñas que contengan:**
- Mínimo 12 caracteres
- Mayúsculas y minúsculas
- Números y símbolos
- Sin palabras del diccionario

### 3. Verificación de Seguridad

El sistema automáticamente:
- ✅ Valida que existan las variables requeridas
- ⚠️ Advierte sobre contraseñas inseguras
- 🔒 Oculta credenciales en los logs
- 🛡️ No expone información sensible

### 4. Archivos Protegidos

Estos archivos están en `.gitignore` y NO se suben a Git:
- `.env` - Variables de entorno reales
- `uploads/*` - Archivos subidos por usuarios
- `node_modules/` - Dependencias

### 5. En Producción

**Para despliegue:**
1. Usa variables de entorno del servidor
2. No incluyas archivos `.env` en el deployment
3. Configura las variables en tu hosting (Heroku, Vercel, etc.)
4. Usa base de datos en la nube con SSL

**Ejemplo para Heroku:**
```bash
heroku config:set DB_HOST=your-db-host
heroku config:set DB_PASSWORD=your-secure-password
heroku config:set JWT_SECRET=your-jwt-secret
```

### 6. Checklist de Seguridad

- [ ] ✅ Archivo `.env` configurado con credenciales reales
- [ ] ✅ Contraseña de PostgreSQL es segura (no la por defecto)
- [ ] ✅ JWT_SECRET generado aleatoriamente
- [ ] ✅ Archivo `.env` en `.gitignore`
- [ ] ✅ No hay credenciales hardcodeadas en el código
- [ ] ✅ Base de datos con acceso restringido
- [ ] ✅ Puerto PostgreSQL no expuesto públicamente

### 7. Troubleshooting

**Error: "Variables de entorno faltantes"**
- Verifica que el archivo `.env` existe
- Asegúrate de que `DB_PASSWORD` está configurado

**Advertencia: "contraseña insegura"**
- Cambia `DB_PASSWORD` por una contraseña fuerte
- No uses las contraseñas por defecto

**Error de conexión a la base de datos**
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en `.env`
- Revisa que el puerto esté correcto

### 8. Recursos Adicionales

- [Generador de contraseñas seguras](https://bitwarden.com/password-generator/)
- [Generador de secretos JWT](https://generate-secret.vercel.app/32)
- [Guía de seguridad PostgreSQL](https://www.postgresql.org/docs/current/security.html)

---

**Recuerda:** La seguridad es responsabilidad de todos. Nunca compartas credenciales ni las subas a repositorios públicos.
