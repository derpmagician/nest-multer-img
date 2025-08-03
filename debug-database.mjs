// Script para debuggear directamente la base de datos y bcrypt
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionConfig = {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'nestjs_multer'
};

async function debugDatabase() {
    console.log('🔍 Debuggeando directamente la base de datos...\n');
    
    const client = new Client({
        host: connectionConfig.host,
        port: connectionConfig.port,
        user: connectionConfig.username,
        password: connectionConfig.password,
        database: connectionConfig.database
    });

    try {
        await client.connect();
        console.log('✅ Conectado a la base de datos\n');

        // 1. Verificar todos los usuarios con sus emails y contraseñas hasheadas
        console.log('1️⃣ Usuarios en la base de datos:');
        const usersResult = await client.query('SELECT id, first_name, last_name, email, password FROM users');
        
        usersResult.rows.forEach((user, index) => {
            console.log(`${index + 1}. ${user.first_name} ${user.last_name}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   🔐 Hash: ${user.password.substring(0, 30)}...`);
            console.log('');
        });

        // 2. Verificar bcrypt con contraseñas conocidas
        console.log('2️⃣ Probando validación bcrypt directamente...\n');
        
        for (const user of usersResult.rows) {
            console.log(`🧪 Probando usuario: ${user.email}`);
            
            const testPasswords = ['admin123', 'password', 'Renzo123', 'renzo123', '123456'];
            
            for (const pwd of testPasswords) {
                try {
                    const isValid = await bcrypt.compare(pwd, user.password);
                    if (isValid) {
                        console.log(`   ✅ ¡CONTRASEÑA CORRECTA! "${pwd}" para ${user.email}`);
                    } else {
                        console.log(`   ❌ "${pwd}" - incorrecta`);
                    }
                } catch (error) {
                    console.log(`   🚨 Error bcrypt con "${pwd}": ${error.message}`);
                }
            }
            console.log('');
        }

        // 3. Generar nuevo hash para comparar
        console.log('3️⃣ Generando nuevo hash de "admin123" para comparar...');
        const newHash = await bcrypt.hash('admin123', 10);
        console.log(`Nuevo hash: ${newHash}`);
        
        // Comparar el nuevo hash
        const testMatch = await bcrypt.compare('admin123', newHash);
        console.log(`¿El nuevo hash funciona? ${testMatch ? '✅ SÍ' : '❌ NO'}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

debugDatabase();
