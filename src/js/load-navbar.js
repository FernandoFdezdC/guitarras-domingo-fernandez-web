// js/load-navbar.js
async function loadNavbar() {
  try {
    console.log('Loading navbar...');

    const response = await fetch('/components/navbar.html');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;

    // --- 1) Add styles (resolving relative paths based on response.url)
    const styles = Array.from(tempContainer.querySelectorAll('style, link[rel="stylesheet"]'));
    styles.forEach(style => {
      if (style.tagName === 'LINK') {
        const href = style.getAttribute('href');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        // resolve relative paths based on response URL
        link.href = href ? new URL(href, response.url).href : '';
        document.head.appendChild(link);
      } else {
        document.head.appendChild(style.cloneNode(true));
      }
    });

    // --- 2) Extract scripts to recreate them later (and remove the originals)
    const scripts = Array.from(tempContainer.querySelectorAll('script'));
    scripts.forEach(s => s.parentNode && s.parentNode.removeChild(s));

    // --- 3) Move all top-level nodes while preserving their order
    const nodes = Array.from(tempContainer.childNodes);
    // Insert in the correct order: iterate from last to first and insert before the body's first child
    for (let i = nodes.length - 1; i >= 0; i--) {
      document.body.insertBefore(nodes[i], document.body.firstChild);
    }

    console.log('Navbar inserted in the DOM (all nodes).');

    // --- 4) (Re)create and execute scripts in their original order
    for (const script of scripts) {
      if (script.src) {
        // External script: create a new <script src="..."> and wait for load to preserve order
        const newScript = document.createElement('script');
        newScript.src = new URL(script.getAttribute('src'), response.url).href;
        newScript.async = false; // preserve order
        document.head.appendChild(newScript);
        // Wait for it to load to ensure global functions are defined
        await new Promise((resolve, reject) => {
          newScript.onload = () => resolve();
          newScript.onerror = () => {
            console.warn('Error cargando script externo de navbar:', newScript.src);
            resolve(); // Do not abort the full load, just continue
          };
        });
      } else {
        // Inline script: create a new <script> with the code and append it to the head -> this executes the code
        const inline = document.createElement('script');
        inline.textContent = script.textContent;
        document.head.appendChild(inline);
      }
    }

    // --- 5) Initialize the navbar (if the function exists)
    if (typeof initNavbar === 'function') {
      console.log('Initializing navbar (initNavbar)...');
      initNavbar();
    } else {
      console.warn('initNavbar is not defined. Trying to manually initialize...');
      if (typeof initializeNavbarManually === 'function') {
        initializeNavbarManually();
      }
    }

    console.log('Navbar successfully loaded');
  } catch (error) {
    console.error('Error loading navbar:', error);
    createFallbackNavbar();
  }
}

// Manual initialization function if initNavbar is not available
function initializeNavbarManually() {
    console.log('Manually initializing navbar...');
    
    // Here we can add basic initialization code if needed,
    // for example, add basic event listeners
    
    // Mobile menu button
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Language selector
    const langTrigger = document.getElementById('lang-trigger');
    const langDropdown = document.getElementById('lang-dropdown');
    
    if (langTrigger && langDropdown) {
        langTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        
        // Close when clicking outside of the dropdown
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

// Initialize loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}

// Make the loadNavbar function globally available in case it's needed
window.loadNavbar = loadNavbar;