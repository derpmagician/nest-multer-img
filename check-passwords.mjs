// Script para verificar contraseñas hasheadas en la base de datos
import * as bcrypt from 'bcrypt';

const API_BASE = 'http://localhost:3000';

async function checkPasswords() {
    console.log('🔍 Verificando contraseñas hasheadas...\n');

    try {
        // Obtener usuarios con sus contraseñas hasheadas
        const response = await fetch(`${API_BASE}/users`);
        const users = await response.json();
        
        console.log('👥 Usuarios en la base de datos:');
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
        });
        console.log('');

        // Probar contraseñas comunes para el admin
        console.log('🧪 Probando contraseñas comunes para admin@example.com...');
        
        const possiblePasswords = [
            'admin123',
            'password',
            'admin',
            'Admin123',
            '123456',
            'password123'
        ];

        for (const pwd of possiblePasswords) {
            console.log(`   🔑 Probando: "${pwd}"`);
            
            const loginResponse = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'admin@example.com',
                    password: pwd
                })
            });
            
            if (loginResponse.ok) {
                console.log(`   ✅ ¡CONTRASEÑA CORRECTA! "${pwd}"`);
                const result = await loginResponse.json();
                console.log(`   👤 Login exitoso para: ${result.user.firstName} ${result.user.lastName}`);
                return;
            } else {
                console.log(`   ❌ Fallida`);
            }
        }
        
        console.log('\n⚠️  Ninguna contraseña común funcionó.');
        console.log('💡 Esto podría indicar que el usuario admin fue creado con otra contraseña');
        console.log('   o que hay un problema en la validación de bcrypt.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkPasswords();
