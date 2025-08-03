// Script para probar con el email correcto del admin
const API_BASE = 'http://localhost:3000';

async function testCorrectAdmin() {
    console.log('🧪 Probando con el email correcto del admin...\n');

    try {
        console.log('1️⃣ Probando login con admin@nestjs-multer.com...');
        
        const loginData = {
            email: 'admin@nestjs-multer.com', // Email correcto del SQL
            password: 'admin123'              // Contraseña original
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
            console.log('   ✅ ¡LOGIN EXITOSO!');
            console.log(`   👤 Usuario: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
            console.log(`   📧 Email: ${loginResult.user.email}`);
            console.log(`   🆔 ID: ${loginResult.user.id}`);
        } else {
            console.log('   ❌ Login fallido:', loginResult.message);
            console.log(`   - Status: ${loginResponse.status}`);
        }

        // También probar con el usuario registrado recientemente
        console.log('\n2️⃣ Probando con renzin@gmail.com...');
        
        const loginData2 = {
            email: 'renzin@gmail.com',
            password: 'Renzo123' // Asumiendo que usó esta contraseña al registrarse
        };
        
        console.log(`   📧 Email: ${loginData2.email}`);
        console.log(`   🔑 Password: ${loginData2.password}`);
        
        const loginResponse2 = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData2)
        });
        
        const loginResult2 = await loginResponse2.json();
        
        if (loginResponse2.ok) {
            console.log('   ✅ ¡LOGIN EXITOSO!');
            console.log(`   👤 Usuario: ${loginResult2.user.firstName} ${loginResult2.user.lastName}`);
            console.log(`   📧 Email: ${loginResult2.user.email}`);
            console.log(`   🆔 ID: ${loginResult2.user.id}`);
        } else {
            console.log('   ❌ Login fallido:', loginResult2.message);
            console.log(`   - Status: ${loginResponse2.status}`);
        }

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

testCorrectAdmin();
