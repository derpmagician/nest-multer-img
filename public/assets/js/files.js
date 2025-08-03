const API_BASE = 'http://localhost:3000';

// Cargar archivos al iniciar
document.addEventListener('DOMContentLoaded', loadFiles);

// Manejar formulario de subida
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    
    if (!file) {
        showMessage('Por favor selecciona un archivo', 'error');
        return;
    }
    
    // Validar que sea una imagen
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
        showMessage('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP, BMP, SVG)', 'error');
        return;
    }
    
    // Validar tamaño (2MB máximo)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        showMessage('El archivo es demasiado grande. Máximo 2MB permitido', 'error');
        return;
    }
    
    formData.append('file', file);
    
    try {
        showMessage('Subiendo imagen...', 'info');
        
        const response = await fetch(`${API_BASE}/files/upload`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(`Imagen "${result.filename}" subida exitosamente`, 'success');
            fileInput.value = '';
            loadFiles(); // Recargar la lista
        } else {
            showMessage(`Error: ${result.message || 'Error al subir imagen'}`, 'error');
        }
    } catch (error) {
        showMessage(`Error de conexión: ${error.message}`, 'error');
    }
});

// Cargar lista de archivos reales
async function loadFiles() {
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = '<div class="loading">Cargando imágenes...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/files`);
        if (response.ok) {
            const files = await response.json();
            displayFiles(files);
        } else {
            throw new Error('Error al obtener la lista de archivos');
        }
    } catch (error) {
        filesList.innerHTML = `<div class="error">Error al cargar archivos: ${error.message}</div>`;
    }
}

// Mostrar archivos en la interfaz
function displayFiles(files) {
    const filesList = document.getElementById('filesList');
    
    if (files.length === 0) {
        filesList.innerHTML = `
            <div class="empty-state">
                <div>📁</div>
                <h3>No hay imágenes subidas</h3>
                <p>Sube tu primera imagen usando el formulario de arriba</p>
            </div>
        `;
        return;
    }
    
    const filesHTML = files.map(file => {
        const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'].includes(file.type.toLowerCase());
        const imagePreview = isImage ? 
            `<img src="${API_BASE}/subidas/${file.name}" alt="${file.name}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : 
            '<div style="height: 150px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 4px; margin-bottom: 10px;">📄</div>';
        
        return `
            <div class="file-card">
                ${imagePreview}
                <div class="file-name">${file.name}</div>
                <div class="file-info">
                    <div>📏 Tamaño: ${file.size}</div>
                    <div>📄 Tipo: ${file.type}</div>
                    <div>📅 Subido: ${file.uploaded}</div>
                </div>
                <div class="file-actions">
                    <a href="${API_BASE}/subidas/${file.name}" target="_blank" class="btn-small btn-view">👁️ Ver</a>
                    <a href="${API_BASE}/subidas/${file.name}" download class="btn-small btn-download">💾 Descargar</a>
                </div>
            </div>
        `;
    }).join('');
    
    filesList.innerHTML = `<div class="files-grid">${filesHTML}</div>`;
}

// Mostrar mensajes
function showMessage(message, type = 'info') {
    const messagesDiv = document.getElementById('messages');
    const messageClass = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
    
    messagesDiv.innerHTML = `<div class="${messageClass}">${message}</div>`;
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
        messagesDiv.innerHTML = '';
    }, 5000);
}

// Función para obtener información de archivo específico
async function getFileInfo(filename) {
    try {
        const response = await fetch(`${API_BASE}/files/${filename}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener información del archivo:', error);
        return null;
    }
}
