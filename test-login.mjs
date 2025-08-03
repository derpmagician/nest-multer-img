// Script para probar el sistema de login
const API_BASE = 'http://localhost:3000';

async function testLogin() {
    console.log('🧪 Probando sistema de login...\n');

    // 1. Primero verificar que hay usuarios en la base de datos
    try {
        console.log('1️⃣ Verificando usuarios existentes...');
        const usersResponse = await fetch(`${API_BASE}/users`);
        const users = await usersResponse.json();
        
        console.log(`   ✅ Encontrados ${users.length} usuarios en la base de datos`);
        users.forEach(user => {
            console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
        });
        console.log('');

        if (users.length === 0) {
            console.log('❌ No hay usuarios para probar. Registra un usuario primero.');
            return;
        }

        // 2. Probar login con el primer usuario (usando credenciales conocidas)
        console.log('2️⃣ Probando login con credenciales del admin...');
        
        const loginData = {
            email: 'admin@example.com', // Del script SQL
            password: 'admin123'        // Contraseña original antes del hash
        };
        
        console.log(`   📧 Email: ${loginData.email}`);
        console.log(`   🔑 Password: ${loginData.password}`);
        
        const loginResponse = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });
        
        const loginResult = await loginResponse.json();
        
        if (loginResponse.ok) {
            console.log('   ✅ Login exitoso!');
            console.log(`   👤 Usuario: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
            console.log(`   📧 Email: ${loginResult.user.email}`);
            console.log(`   🆔 ID: ${loginResult.user.id}`);
        } else {
            console.log('   ❌ Login fallido:', loginResult.message);
            
            // Mostrar información de debug
            console.log('   🔍 Información de debug:');
            console.log(`   - Status: ${loginResponse.status}`);
            console.log(`   - Response: ${JSON.stringify(loginResult, null, 2)}`);
        }

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

// Ejecutar pruebas
testLogin();
