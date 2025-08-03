// Script para crear un usuario de prueba y probar login inmediatamente
const API_BASE = 'http://localhost:3000';

async function testCompleteFlow() {
    console.log('🧪 Probando flujo completo: Registro + Login...\n');

    const testUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        username: 'testuser',
        password: 'Test123!',
        country: 'US',
        newsletterSubscription: false,
        termsAccepted: true
    };

    try {
        // 1. Registrar un nuevo usuario
        console.log('1️⃣ Registrando usuario de prueba...');
        console.log(`   📧 Email: ${testUser.email}`);
        console.log(`   🔑 Password: ${testUser.password}`);
        
        const registerResponse = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testUser)
        });

        if (registerResponse.ok) {
            const registeredUser = await registerResponse.json();
            console.log('   ✅ Usuario registrado exitosamente!');
            console.log(`   🆔 ID: ${registeredUser.id}`);
            console.log('');

            // 2. Intentar hacer login inmediatamente
            console.log('2️⃣ Intentando login inmediatamente...');
            
            const loginData = {
                email: testUser.email,
                password: testUser.password
            };
            
            const loginResponse = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });
            
            const loginResult = await loginResponse.json();
            
            if (loginResponse.ok) {
                console.log('   ✅ ¡LOGIN EXITOSO! El sistema funciona correctamente.');
                console.log(`   👤 Usuario: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
                console.log(`   📧 Email: ${loginResult.user.email}`);
                console.log(`   🆔 ID: ${loginResult.user.id}`);
                console.log('\n🎉 ¡El problema era con las contraseñas de los usuarios existentes!');
                console.log('💡 Los usuarios admin y renzo fueron creados con contraseñas diferentes.');
            } else {
                console.log('   ❌ Login fallido:', loginResult.message);
                console.log(`   - Status: ${loginResponse.status}`);
                console.log('🚨 Hay un problema en el sistema de autenticación.');
            }

        } else {
            const errorResult = await registerResponse.json();
            if (registerResponse.status === 409) {
                console.log('   ⚠️  Usuario ya existe, probando login directo...');
                
                // Intentar login con usuario existente
                const loginData = {
                    email: testUser.email,
                    password: testUser.password
                };
                
                const loginResponse = await fetch(`${API_BASE}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });
                
                const loginResult = await loginResponse.json();
                
                if (loginResponse.ok) {
                    console.log('   ✅ ¡LOGIN EXITOSO con usuario existente!');
                    console.log(`   👤 Usuario: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
                } else {
                    console.log('   ❌ Login fallido con usuario existente:', loginResult.message);
                }
            } else {
                console.log('   ❌ Error en registro:', errorResult.message);
            }
        }

    } catch (error) {
        console.error('❌ Error durante la prueba:', error.message);
    }
}

testCompleteFlow();
