// Variables globales
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const loginBtn = document.getElementById('loginBtn');
const closeSidebar = document.getElementById('closeSidebar');
const getStartedBtn = document.getElementById('getStartedBtn');
const loginForm = document.getElementById('loginForm');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkAuthStatus();
});

function initializeEventListeners() {
    // Abrir sidebar de login
    loginBtn.addEventListener('click', openSidebar);
    getStartedBtn.addEventListener('click', openSidebar);
    
    // Cerrar sidebar
    closeSidebar.addEventListener('click', closeSidebarHandler);
    overlay.addEventListener('click', closeSidebarHandler);
    
    // Manejar formulario de login
    loginForm.addEventListener('submit', handleLogin);
    
    // Smooth scroll para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Enlaces adicionales
    document.getElementById('registerLink').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Redirigiendo a la página de registro...', 'info');
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 1000);
    });
    
    document.getElementById('forgotPassword').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('Funcionalidad de recuperación de contraseña próximamente', 'info');
    });
}

function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebarHandler() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validación básica
    if (!username || !password) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Simulación de login (aquí conectarías con tu backend)
    showMessage('Iniciando sesión...', 'info');
    
    // Simular delay de autenticación
    setTimeout(() => {
        // Credenciales de ejemplo
        if (username === 'admin' && password === 'admin123') {
            showMessage('¡Bienvenido! Redirigiendo...', 'success');
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            setTimeout(() => {
                window.location.href = 'files.html';
            }, 1500);
        } else {
            showMessage('Credenciales incorrectas', 'error');
        }
    }, 1000);
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn === 'true' && username) {
        loginBtn.textContent = `Hola, ${username}`;
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLogoutMenu();
        });
    }
}

function showLogoutMenu() {
    const confirmed = confirm('¿Deseas cerrar sesión?');
    if (confirmed) {
        logout();
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    loginBtn.textContent = 'Iniciar Sesión';
    showMessage('Sesión cerrada exitosamente', 'success');
    
    // Recargar event listeners
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function showMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Estilos para el mensaje
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Colores según el tipo
    switch(type) {
        case 'success':
            messageDiv.style.backgroundColor = '#28a745';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#ffc107';
            messageDiv.style.color = '#212529';
            break;
        default:
            messageDiv.style.backgroundColor = '#17a2b8';
    }
    
    // Agregar al DOM
    document.body.appendChild(messageDiv);
    
    // Animar entrada
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Función para animar elementos al hacer scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .stat, .about-text');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Ejecutar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Manejar escape key para cerrar sidebar
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebarHandler();
    }
});

// Prevenir scroll del body cuando el sidebar está abierto
sidebar.addEventListener('scroll', function(e) {
    e.stopPropagation();
});

// Demo de funcionalidades
function showDemo() {
    showMessage('Redirigiendo a la demo...', 'info');
    setTimeout(() => {
        window.location.href = 'files.html';
    }, 1000);
}

// Credenciales de demo para mostrar al usuario
function showDemoCredentials() {
    showMessage('Demo: Usuario: admin, Contraseña: admin123', 'info');
}
