// js/load-navbar.js
async function loadNavbar() {
    try {
        console.log('Cargando navbar...');
        
        // Hacer la petición para obtener el contenido de la navbar
        const response = await fetch('/components/navbar.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        console.log('Navbar HTML obtenido:', html.length, 'caracteres');
        
        // Crear un contenedor temporal para procesar el HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        
        // Extraer y agregar los estilos primero (manejar rutas CSS)
        const styles = tempContainer.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(style => {
            console.log('Añadiendo estilo de la navbar');
            
            // Si es un enlace CSS, ajustar la ruta
            if (style.tagName === 'LINK' && style.href) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = style.href;
                document.head.appendChild(link);
            } else {
                // Si es estilo inline
                document.head.appendChild(style.cloneNode(true));
            }
        });
        
        // Extraer el contenido HTML principal
        const navbarContent = tempContainer.querySelector('nav') || tempContainer;
        
        // Crear contenedor para la navbar
        const navbarContainer = document.createElement('div');
        navbarContainer.id = 'navbar-container';
        navbarContainer.innerHTML = navbarContent.innerHTML;
        
        // Insertar la navbar al principio del body
        document.body.insertBefore(navbarContainer, document.body.firstChild);
        
        console.log('Navbar insertada en el DOM');
        
        // Extraer y ejecutar los scripts de la navbar
        const scripts = tempContainer.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                // Script externo
                const newScript = document.createElement('script');
                newScript.src = script.src;
                document.head.appendChild(newScript);
            } else {
                // Script inline - ejecutar directamente
                try {
                    console.log('Ejecutando script de la navbar');
                    // Usar Function constructor para ejecutar en ámbito global
                    const executeScript = new Function(script.textContent);
                    executeScript();
                } catch (error) {
                    console.error('Error ejecutando script de navbar:', error);
                }
            }
        });
        
        // Intentar llamar a initNavbar si existe
        setTimeout(() => {
            if (typeof initNavbar === 'function') {
                console.log('Inicializando navbar...');
                initNavbar();
            } else {
                console.warn('initNavbar no está definida. Intentando inicializar manualmente.');
                initializeNavbarManually();
            }
        }, 100);
        
        console.log('Navbar cargada exitosamente');
        
    } catch (error) {
        console.error('Error loading navbar:', error);
        // Crear una navbar básica como fallback
        createFallbackNavbar();
    }
}

// Función de inicialización manual si initNavbar no está disponible
function initializeNavbarManually() {
    console.log('Inicializando navbar manualmente...');
    
    // Aquí puedes agregar código de inicialización básico si es necesario
    // Por ejemplo, agregar event listeners básicos
    
    // Botón de menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Selector de idioma
    const langTrigger = document.getElementById('lang-trigger');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langTrigger && langDropdown) {
        langTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        
        // Cerrar al hacer clic fuera
        document.addEventListener('click', () => {
            langDropdown.classList.add('hidden');
        });
    }
}

function createFallbackNavbar() {
    const fallbackNav = `
        <nav style="background-color: #4d0000; padding: 1rem; color: white;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; font-weight: bold;">Guitarras Domingo Fernández</span>
                <div>
                    <a href="../es/index.html" style="color: white; margin: 0 10px;">ES</a>
                    <a href="../en/index.html" style="color: white; margin: 0 10px;">EN</a>
                </div>
            </div>
        </nav>
    `;
    
    const container = document.createElement('div');
    container.innerHTML = fallbackNav;
    document.body.insertBefore(container, document.body.firstChild);
}

// Iniciar la carga cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}

// Hacer la función loadNavbar disponible globalmente por si se necesita
window.loadNavbar = loadNavbar;