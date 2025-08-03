//-- filepath: c:\Programar\js\nestjs-multer\src\database\setup.ts
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function maskPassword(config: DatabaseConfig): Partial<DatabaseConfig> {
  return {
    host: config.host,
    port: config.port,
    user: config.user,
    password: '***',
    database: config.database,
  };
}

function getDatabaseConfig(): DatabaseConfig {
  // Validar que las variables de entorno requeridas estén presentes
  const requiredEnvVars = ['DB_PASSWORD'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Variables de entorno faltantes: ${missingVars.join(', ')}`);
  }

  // Validar que no se esté usando la contraseña por defecto
  const password = process.env.DB_PASSWORD!;
  if (password === '123456' || password === 'password' || password === 'postgres') {
    console.warn('⚠️  ADVERTENCIA: Estás usando una contraseña insegura. Cambia DB_PASSWORD en el archivo .env');
  }

  // Validar puerto
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    throw new Error('Puerto de base de datos inválido');
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port,
    user: process.env.DB_USERNAME || 'postgres',
    password,
    database: process.env.DB_NAME || 'nestjs_multer',
  };
}

async function createDatabase(): Promise<void> {
  const config = getDatabaseConfig();
  
  // Log seguro (sin mostrar contraseña)
  console.log('🔧 Configuración de conexión:', maskPassword(config));
  
  // Conexión inicial sin especificar base de datos (para crear la DB)
  const adminClient = new Client({
    ...config,
    database: 'postgres', // Conectar a la DB por defecto
  });

  let dbClient: Client | undefined;

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await adminClient.connect();

    // Verificar si la base de datos ya existe
    const dbExistsResult = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [config.database]
    );

    if (dbExistsResult.rows.length === 0) {
      console.log('📦 Creando base de datos...');
      await adminClient.query(
        `CREATE DATABASE "${config.database}" WITH ENCODING = 'UTF8'`
      );
      console.log('✅ Base de datos creada exitosamente');
    } else {
      console.log('ℹ️  La base de datos ya existe');
    }

    await adminClient.end();

    // Ahora conectar a la nueva base de datos para crear las tablas
    dbClient = new Client(config);

    console.log('🔌 Conectando a la nueva base de datos...');
    await dbClient.connect();

    // Leer y ejecutar el script SQL
    const sqlPath = path.join(__dirname, '..', '..', 'database', 'init.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Archivo SQL no encontrado: ${sqlPath}`);
    }

    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    // Dividir el script en comandos individuales
    const commands = sqlScript
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
      .filter(cmd => !cmd.startsWith('\\c')) // Excluir comandos de conexión
      .filter(cmd => !cmd.includes('CREATE DATABASE')); // Excluir creación de DB

    console.log('📋 Ejecutando script de inicialización...');
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          await dbClient.query(command);
        } catch (error: any) {
          // Ignorar errores específicos de elementos que ya existen
          const ignoredErrors = [
            'already exists',
            'duplicate key',
            'relation "users" already exists',
            'extension "uuid-ossp" already exists'
          ];

          const shouldIgnore = ignoredErrors.some(err => 
            error.message.toLowerCase().includes(err.toLowerCase())
          );

          if (!shouldIgnore) {
            console.warn(`⚠️  Advertencia en comando: ${command.substring(0, 50)}...`);
            console.warn(`   Error: ${error.message}`);
          }
        }
      }
    }

    console.log('✅ Script de inicialización ejecutado');

    // Verificar que las tablas se crearon correctamente
    const tablesResult = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);

    console.log('📊 Tablas creadas:');
    if (tablesResult.rows.length === 0) {
      console.log('   ❌ No se encontraron tablas');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    // Verificar usuarios
    try {
      const usersCount = await dbClient.query('SELECT COUNT(*) FROM users');
      console.log(`👥 Usuarios en la base de datos: ${usersCount.rows[0].count}`);
    } catch (error: any) {
      console.warn('⚠️  No se pudo verificar la tabla users:', error.message);
    }

    await dbClient.end();
    console.log('🎉 Base de datos configurada exitosamente');

  } catch (error: any) {
    console.error('❌ Error configurando la base de datos:', error.message);
    
    // Cerrar conexiones abiertas
    try {
      await adminClient.end();
    } catch (e) {
      // Ignorar errores de cierre
    }
    
    if (dbClient) {
      try {
        await dbClient.end();
      } catch (e) {
        // Ignorar errores de cierre
      }
    }
    
    throw error;
  }
}

async function testConnection(): Promise<void> {
  const config = getDatabaseConfig();
  console.log('🔧 Probando conexión con:', maskPassword(config));
  
  const client = new Client(config);

  try {
    console.log('🧪 Probando conexión...');
    await client.connect();
    
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Conexión exitosa. Hora del servidor:', result.rows[0].current_time);
    console.log('🗄️  Versión PostgreSQL:', result.rows[0].pg_version.split(' ')[0]);
    
    await client.end();
  } catch (error: any) {
    console.error('❌ Error de conexión:', error.message);
    throw error;
  }
}

// Función principal
async function main(): Promise<void> {
  console.log('🚀 Iniciando configuración de base de datos...\n');
  
  try {
    await createDatabase();
    await testConnection();
    console.log('\n✨ Configuración completada. La aplicación está lista para usar.');
  } catch (error: any) {
    console.error('\n💥 Error en la configuración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  // Verificar si se pasó el argumento --test-only
  const testOnly = process.argv.includes('--test-only');
  
  if (testOnly) {
    // Solo probar conexión
    testConnection().catch(error => {
      console.error('Error en prueba de conexión:', error.message);
      process.exit(1);
    });
  } else {
    // Ejecutar configuración completa
    main();
  }
}

export { createDatabase, testConnection, getDatabaseConfig, maskPassword };