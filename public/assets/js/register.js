// Variables globales
const registerForm = document.getElementById('registerForm');
const submitBtn = document.getElementById('submitBtn');
const messageContainer = document.getElementById('messageContainer');

// Regex patterns para validación
const patterns = {
    // Expresiones regulares para validación
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    username: /^[a-zA-Z0-9_-]{3,20}$/, // 3-20 caracteres, letras, números, guiones y guiones bajos permitidos
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
    name: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,30}$/ // Nombres y apellidos, 2-30 caracteres, letras y espacios permitidos
};

const API_BASE = 'http://localhost:3000';

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeValidation();
});

function initializeEventListeners() {
    // Manejar envío del formulario
    registerForm.addEventListener('submit', handleRegistration);
    
    // Validación en tiempo real
    const inputs = registerForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
    
    // Validación especial para contraseña
    document.getElementById('password').addEventListener('input', checkPasswordStrength);
    document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);
    
    // Validación de username y email en tiempo real
    document.getElementById('username').addEventListener('input', debounce(checkUsernameAvailability, 500));
    document.getElementById('email').addEventListener('input', debounce(checkEmailAvailability, 500));
}

function initializeValidation() {
    // Configurar validaciones personalizadas
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    
    emailInput.addEventListener('input', () => validateEmail(emailInput.value));
    usernameInput.addEventListener('input', () => validateUsername(usernameInput.value));
}

// Función principal de registro
async function handleRegistration(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showMessage('Por favor corrige los errores antes de continuar', 'error');
        return;
    }
    
    const formData = new FormData(registerForm);
    const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || null,
        username: formData.get('username'),
        password: formData.get('password'),
        country: formData.get('country') || null,
        newsletterSubscription: formData.get('newsletter') === 'on',
        termsAccepted: formData.get('terms') === 'on'
    };
    
    // Mostrar estado de carga
    setLoadingState(true);
    
    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
            
            // Guardar datos del usuario
            localStorage.setItem('userData', JSON.stringify({
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                firstName: result.user.firstName,
                lastName: result.user.lastName
            }));
            
            // Redireccionar después del registro
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage(result.message || 'Error al crear la cuenta', 'error');
        }
        
    } catch (error) {
        showMessage('Error de conexión. Intenta nuevamente.', 'error');
        console.error('Registration error:', error);
    } finally {
        setLoadingState(false);
    }
}

// Verificar disponibilidad de email
async function checkEmailAvailability(email) {
    if (!email || !patterns.email.test(email)) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/check-email?email=${encodeURIComponent(email)}`);
        const result = await response.json();
        
        if (!result.available) {
            showError('email', 'Este correo electrónico ya está registrado');
        } else {
            clearError(document.getElementById('email'));
        }
    } catch (error) {
        console.error('Error checking email availability:', error);
    }
}

// Verificar disponibilidad de username
async function checkUsernameAvailability(username) {
    if (!username || !patterns.username.test(username)) return;
    
    try {
        const response = await fetch(`${API_BASE}/users/check-username?username=${encodeURIComponent(username)}`);
        const result = await response.json();
        
        if (!result.available) {
            showError('username', 'Este nombre de usuario no está disponible');
        } else {
            clearError(document.getElementById('username'));
        }
    } catch (error) {
        console.error('Error checking username availability:', error);
    }
}

// Validación completa del formulario
function validateForm() {
    let isValid = true;
    const requiredFields = ['firstName', 'lastName', 'email', 'username', 'password', 'confirmPassword'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validar términos y condiciones
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showError('terms', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }
    
    return isValid;
}

// Validación individual de campos
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    
    // Limpiar errores previos
    clearError(field);
    
    // Validaciones por tipo de campo
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                showError(fieldName, 'Este campo es requerido');
                isValid = false;
            } else if (!patterns.name.test(value)) {
                showError(fieldName, 'Solo se permiten letras y espacios');
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                showError(fieldName, 'El correo electrónico es requerido');
                isValid = false;
            } else if (!patterns.email.test(value)) {
                showError(fieldName, 'Ingresa un correo electrónico válido');
                isValid = false;
            }
            break;
            
        case 'phone':
            if (value && !patterns.phone.test(value)) {
                showError(fieldName, 'Ingresa un número de teléfono válido');
                isValid = false;
            }
            break;
            
        case 'username':
            if (!value) {
                showError(fieldName, 'El nombre de usuario es requerido');
                isValid = false;
            } else if (!patterns.username.test(value)) {
                showError(fieldName, 'Mínimo 3 caracteres, solo letras, números y guiones');
                isValid = false;
            }
            break;
            
        case 'password':
            if (!value) {
                showError(fieldName, 'La contraseña es requerida');
                isValid = false;
            } else if (!patterns.password.test(value)) {
                showError(fieldName, 'Mínimo 8 caracteres, incluye mayúscula, minúscula y número');
                isValid = false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!value) {
                showError(fieldName, 'Confirma tu contraseña');
                isValid = false;
            } else if (value !== password) {
                showError(fieldName, 'Las contraseñas no coinciden');
                isValid = false;
            }
            break;
    }
    
    return isValid;
}

// Validación de email
function validateEmail(email) {
    const emailField = document.getElementById('email');
    if (email && patterns.email.test(email)) {
        // La verificación se hace en checkEmailAvailability
    }
}

// Validación de username
function validateUsername(username) {
    if (username && patterns.username.test(username)) {
        // La verificación se hace en checkUsernameAvailability
    }
}

// Verificar fortaleza de contraseña
function checkPasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    let strength = 0;
    let strengthClass = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    if (strength <= 2) {
        strengthClass = 'weak';
    } else if (strength <= 4) {
        strengthClass = 'medium';
    } else {
        strengthClass = 'strong';
    }
    
    strengthIndicator.className = `password-strength ${strengthClass}`;
}

// Validar coincidencia de contraseñas
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        showError('confirmPassword', 'Las contraseñas no coinciden');
    } else if (confirmPassword) {
        clearError(document.getElementById('confirmPassword'));
    }
}

// Mostrar/ocultar contraseña
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    
    if (field.type === 'password') {
        field.type = 'text';
        button.textContent = '🙈';
    } else {
        field.type = 'password';
        button.textContent = '👁️';
    }
}

// Mostrar errores
function showError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Limpiar errores
function clearError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

// Estado de carga
function setLoadingState(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        submitBtn.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Mostrar mensajes
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Animar entrada
    setTimeout(() => messageDiv.classList.add('show'), 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Utility function: debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Animaciones de entrada
function animateElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.form-section, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', animateElements);