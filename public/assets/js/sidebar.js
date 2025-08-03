/**
 * Sidebar Manager - Maneja el sidebar de usuario compartido
 */
class SidebarManager {
    constructor() {
        this.isOpen = false;
        this.userData = null;
        this.init();
    }

    init() {
        this.checkUserAuth();
        this.createSidebar();
        this.bindEvents();
    }

    checkUserAuth() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                this.userData = JSON.parse(userData);
                if (!this.userData.isLoggedIn) {
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.redirectToLogin();
            }
        } else {
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
    }

    createSidebar() {
        if (!this.userData) return;

        // Crear toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.id = 'sidebarToggle';
        document.body.appendChild(toggleBtn);

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);

        // Crear sidebar
        const sidebar = document.createElement('div');
        sidebar.className = 'user-sidebar';
        sidebar.id = 'userSidebar';
        
        sidebar.innerHTML = this.getSidebarHTML();
        document.body.appendChild(sidebar);

        // Marcar página actual
        this.setActivePage();
    }

    getSidebarHTML() {
        const fullName = `${this.userData.firstName} ${this.userData.lastName}`;
        const initials = `${this.userData.firstName[0]}${this.userData.lastName[0]}`.toUpperCase();
        
        return `
            <div class="sidebar-header">
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <h3>${fullName}</h3>
                    <p>${this.userData.email}</p>
                </div>
            </div>
            
            <nav class="sidebar-menu">
                <a href="files.html" class="menu-item" data-page="files">
                    <i>📁</i> Gestión de Archivos
                </a>
                <a href="profile.html" class="menu-item" data-page="profile">
                    <i>👤</i> Mi Perfil
                </a>
                <a href="settings.html" class="menu-item" data-page="settings">
                    <i>⚙️</i> Configuración
                </a>
                <button class="menu-item" onclick="sidebarManager.showHelp()">
                    <i>❓</i> Ayuda
                </button>
            </nav>
            
            <div class="sidebar-footer">
                <button class="logout-btn" onclick="sidebarManager.logout()">
                    🚪 Cerrar Sesión
                </button>
            </div>
        `;
    }

    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        const menuItems = document.querySelectorAll('.menu-item[data-page]');
        
        menuItems.forEach(item => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === currentPage) {
                item.classList.add('active');
            }
        });
    }

    bindEvents() {
        // Toggle sidebar
        document.addEventListener('click', (e) => {
            if (e.target.id === 'sidebarToggle') {
                this.toggle();
            }
            
            if (e.target.id === 'sidebarOverlay') {
                this.close();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Responsive behavior
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                document.querySelector('.main-content')?.classList.add('sidebar-open');
            } else {
                document.querySelector('.main-content')?.classList.remove('sidebar-open');
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const sidebar = document.getElementById('userSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const toggle = document.getElementById('sidebarToggle');
        const mainContent = document.querySelector('.main-content');

        sidebar?.classList.add('active');
        overlay?.classList.add('active');
        toggle?.classList.add('active');
        
        if (window.innerWidth > 768) {
            mainContent?.classList.add('sidebar-open');
        }

        this.isOpen = true;
    }

    close() {
        const sidebar = document.getElementById('userSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const toggle = document.getElementById('sidebarToggle');
        const mainContent = document.querySelector('.main-content');

        sidebar?.classList.remove('active');
        overlay?.classList.remove('active');
        toggle?.classList.remove('active');
        mainContent?.classList.remove('sidebar-open');

        this.isOpen = false;
    }

    logout() {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            
            // Mostrar mensaje y redireccionar
            this.showMessage('Sesión cerrada exitosamente', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    showHelp() {
        alert(`¡Hola ${this.userData.firstName}!

Bienvenido al sistema de gestión de archivos.

Funcionalidades disponibles:
• 📁 Gestión de Archivos: Sube y administra tus imágenes
• 👤 Mi Perfil: Edita tu información personal
• ⚙️ Configuración: Personaliza tu experiencia

Formatos soportados:
• Imágenes: JPEG, PNG, GIF, WebP, BMP, SVG
• Tamaño máximo: 2MB por archivo

¿Necesitas más ayuda? Contacta a soporte: support@filemanager.com`);
    }

    showMessage(message, type = 'info') {
        // Crear o encontrar el contenedor de mensajes
        let messageContainer = document.getElementById('messages');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'messages';
            messageContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 300px;
            `;
            document.body.appendChild(messageContainer);
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-bottom: 0.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        messageDiv.textContent = message;
        
        messageContainer.appendChild(messageDiv);

        // Animar entrada
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(0)';
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                messageContainer.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    // Actualizar información del usuario
    updateUserInfo(newUserData) {
        this.userData = { ...this.userData, ...newUserData };
        localStorage.setItem('userData', JSON.stringify(this.userData));
        
        // Actualizar el sidebar si está creado
        const sidebar = document.getElementById('userSidebar');
        if (sidebar) {
            sidebar.innerHTML = this.getSidebarHTML();
            this.setActivePage();
        }
    }
}

// Instancia global
let sidebarManager = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar en páginas que no sean de login/registro
    const publicPages = ['index.html', 'register.html', ''];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!publicPages.includes(currentPage)) {
        sidebarManager = new SidebarManager();
    }
});

// Exportar para uso global
window.SidebarManager = SidebarManager;
window.sidebarManager = sidebarManager;
