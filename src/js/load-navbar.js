// js/load-navbar.js
async function loadNavbar() {
  try {
    console.log('Cargando navbar...');

    const response = await fetch('/components/navbar.html');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;

    // --- 1) Añadir estilos (resolviendo rutas relativas respecto a response.url)
    const styles = Array.from(tempContainer.querySelectorAll('style, link[rel="stylesheet"]'));
    styles.forEach(style => {
      if (style.tagName === 'LINK') {
        const href = style.getAttribute('href');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // resuelve rutas relativas contra la URL de la respuesta
        link.href = href ? new URL(href, response.url).href : '';
        document.head.appendChild(link);
      } else {
        document.head.appendChild(style.cloneNode(true));
      }
    });

    // --- 2) Extraer scripts para recrearlos más tarde (y removemos los originales)
    const scripts = Array.from(tempContainer.querySelectorAll('script'));
    scripts.forEach(s => s.parentNode && s.parentNode.removeChild(s));

    // --- 3) Mover todos los nodos top-level preservando el orden
    const nodes = Array.from(tempContainer.childNodes);
    // insertamos en orden correcto: iteramos de último a primero y los insertamos antes del primer hijo del body
    for (let i = nodes.length - 1; i >= 0; i--) {
      document.body.insertBefore(nodes[i], document.body.firstChild);
    }

    console.log('Navbar insertada en el DOM (todos los nodos).');

    // --- 4) (Re)crear y ejecutar scripts en el orden original
    for (const script of scripts) {
      if (script.src) {
        // script externo: crear nuevo <script src="..."> y esperar a load para preservar orden
        const newScript = document.createElement('script');
        newScript.src = new URL(script.getAttribute('src'), response.url).href;
        newScript.async = false; // mantener orden
        document.head.appendChild(newScript);
        // esperar a que cargue para asegurar que funciones globales queden definidas
        await new Promise((resolve, reject) => {
          newScript.onload = () => resolve();
          newScript.onerror = () => {
            console.warn('Error cargando script externo de navbar:', newScript.src);
            resolve(); // no abortamos la carga total, solo continuamos
          };
        });
      } else {
        // script inline: crear un nuevo <script> con el texto y añadir al head -> esto ejecuta el código
        const inline = document.createElement('script');
        inline.textContent = script.textContent;
        document.head.appendChild(inline);
      }
    }

    // --- 5) Inicializar la navbar (si existe la función)
    if (typeof initNavbar === 'function') {
      console.log('Inicializando navbar (initNavbar)...');
      initNavbar();
    } else {
      console.warn('initNavbar no está definida. Intentando inicializar manualmente.');
      if (typeof initializeNavbarManually === 'function') {
        initializeNavbarManually();
      }
    }

    console.log('Navbar cargada exitosamente');
  } catch (error) {
    console.error('Error loading navbar:', error);
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