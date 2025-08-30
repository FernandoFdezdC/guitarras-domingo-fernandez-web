// js/load-navbar.js - Versión con todo el JS de la navbar integrado
// Carga /components/navbar.html, lo inserta en el DOM y define/ejecuta toda la lógica de UI de la navbar aquí.

/* ---------- util: resolver rutas relativas usando la base de /components/navbar.html ---------- */
const NAVBAR_OBJECT_PATH = '/components/navbar.html';
const NAVBAR_BASE_URL = new URL(NAVBAR_OBJECT_PATH, window.location.origin);

/* ---------- Función principal que carga el HTML y arranca la navbar ---------- */
async function loadNavbar() {
  try {
    console.log('[load-navbar] Cargando navbar...');

    // Cache buster útil para pruebas
    const res = await fetch(NAVBAR_OBJECT_PATH + '?cb=' + Date.now());
    if (!res.ok) throw new Error(`Navbar fetch failed: ${res.status}`);
    const html = await res.text();
    console.log('[load-navbar] Navbar HTML obtenido:', html.length, 'caracteres');

    // Parsear
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = html;

    // 1) Añadir estilos (<link> y <style>) desde el HTML de la navbar al <head>
    const styleNodes = tempContainer.querySelectorAll('style, link[rel="stylesheet"]');
    styleNodes.forEach(node => {
      if (node.tagName === 'LINK') {
        const rawHref = node.getAttribute('href') || '';
        // Resolver rutas relativas respecto a NAVBAR_BASE_URL
        const resolved = (!rawHref.startsWith('http') && !rawHref.startsWith('//') && !rawHref.startsWith('/'))
          ? new URL(rawHref, NAVBAR_BASE_URL).href
          : rawHref;
        console.log('[load-navbar] añadiendo stylesheet:', resolved);
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = resolved;
        document.head.appendChild(link);
      } else {
        // estilo inline
        document.head.appendChild(node.cloneNode(true));
      }
    });

    // 2) Extraer el contenido principal de la navbar (nav) y reparar rutas internas
    const navbarContent = tempContainer.querySelector('nav') || tempContainer;

    // Reparar atributos href/src/action dentro del contenido antes de insertarlo
    const nodesToFix = navbarContent.querySelectorAll('[href], [src], [action]');
    nodesToFix.forEach(node => {
      ['href', 'src', 'action'].forEach(attr => {
        if (!node.hasAttribute(attr)) return;
        const val = node.getAttribute(attr);
        if (!val) return;
        // Ignorar anchors, mailto, tel, data: y URLs absolutas
        if (val.startsWith('#') || val.startsWith('mailto:') || val.startsWith('tel:') ||
            val.startsWith('data:') || val.startsWith('http') || val.startsWith('//') || val.startsWith('/')) {
          // Si empieza por '/', lo dejamos: ruta absoluta desde root (buena práctica)
          return;
        }
        try {
          const resolved = new URL(val, NAVBAR_BASE_URL).href;
          node.setAttribute(attr, resolved);
          console.log('[load-navbar] resolviendo', attr, val, '->', resolved);
        } catch (e) {
          // no romper si falla
        }
      });
    });

    // 3) Insertar la navbar al principio del body
    const navbarContainer = document.createElement('div');
    navbarContainer.id = 'navbar-container';
    navbarContainer.innerHTML = navbarContent.innerHTML;
    document.body.insertBefore(navbarContainer, document.body.firstChild);
    console.log('[load-navbar] Navbar insertada en el DOM');

    // 4) Marcar que la navbar fue inyectada (permitirá que la lógica en este archivo sepa el contexto)
    window.__NAVBAR_INJECTED = true;

    // 5) Definir toda la lógica/behaviour de la navbar (helpers, init, handlers)
    defineNavbarLogic();

    // 6) Inicializar
    if (typeof window.initNavbar === 'function') {
      try {
        window.initNavbar();
        console.log('[load-navbar] initNavbar ejecutada');
      } catch (e) {
        console.error('[load-navbar] initNavbar error:', e);
      }
    } else {
      console.warn('[load-navbar] initNavbar no está definida');
      initializeNavbarManually(); // fallback
    }

    console.log('[load-navbar] proceso finalizado');

  } catch (err) {
    console.error('[load-navbar] Error loading navbar:', err);
    createFallbackNavbar();
  }
}

/* ---------- Si el DOM ya está listo, iniciar, si no esperar ---------- */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
  loadNavbar();
}
window.loadNavbar = loadNavbar;

/* ---------- Helpers y lógica de la navbar (inyectados aquí) ---------- */
function defineNavbarLogic() {
  // Si ya definimos la lógica antes, no redefinir
  if (window._navbarLogicDefined) return;
  window._navbarLogicDefined = true;

  /* ---------- cookies helpers ---------- */
  function getCookie(name) {
    const v = `; ${document.cookie}`;
    const parts = v.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
  }
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days || 365) * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
  }

  /* ---------- traducciones simples ---------- */
  const translations = {
    es: {
      title: "Guitarras Domingo Fernández",
      home: "Inicio",
      guitars: "Guitarras",
      contact: "Contacto",
      language: "Idioma",
      loading: "Cargando..."
    },
    en: {
      title: "Guitars Domingo Fernández",
      home: "Home",
      guitars: "Guitars",
      contact: "Contact",
      language: "Language",
      loading: "Loading..."
    }
  };

  /* ---------- Estado ---------- */
  let currentLang = 'es';
  let menuOpen = false;
  let langDropdownOpen = false;

  /* ---------- util rutas (preserva la ruta tras cambiar idioma) ---------- */
  function buildPathWithLang(lang) {
    // Reemplaza/Inserta el primer segmento de la ruta con lang.
    const pathname = window.location.pathname;
    const parts = pathname.split('/'); // ['', 'es', 'guitarras', ...] o ['', '']
    if (!parts[1] || (parts[1] !== 'es' && parts[1] !== 'en')) {
      // no hay segmento de idioma -> insertar
      const newPath = (`/${lang}${pathname}`).replace(/\/+/g, '/');
      return newPath.endsWith('/') ? newPath : newPath + '/';
    } else if (parts[1] !== lang) {
      parts[1] = lang;
      let p = parts.join('/');
      p = p.replace(/\/+/g, '/');
      // Normalizar: si termina en /index.html quítalo
      if (p.endsWith('/index.html')) p = p.replace(/\/index\.html$/, '/');
      return p.endsWith('/') ? p : p + '/';
    } else {
      // ya está en el mismo idioma; normalizar trailing slash
      return pathname.endsWith('/') ? pathname : pathname.replace(/\/index\.html$/, '/');
    }
  }

  /* ---------- actualizar textos y links ---------- */
  function updateTexts() {
    const t = translations[currentLang] || translations.es;
    const elTitle = document.getElementById('nav-title');
    if (elTitle) elTitle.textContent = t.title;
    const mapText = [
      ['nav-home', t.home],
      ['nav-guitars', t.guitars],
      ['nav-contact', t.contact],
      ['mobile-nav-home', t.home],
      ['mobile-nav-guitars', t.guitars],
      ['mobile-nav-contact', t.contact],
    ];
    mapText.forEach(([id, txt]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    });
    const mobileLangBtn = document.getElementById('mobile-lang-button');
    if (mobileLangBtn) mobileLangBtn.textContent = t.language;
    const overlaySpan = document.querySelector('#loading-overlay span');
    if (overlaySpan) overlaySpan.textContent = t.loading;
  }

  function setupLinks() {
    const basePath = `/${currentLang}`;
    // rutas con trailing slash
    const homeHref = `${basePath}/`;
    const guitarsHref = `${basePath}/guitarras/`;
    const contactHref = `${basePath}/contacto/`;
    const map = [
      ['nav-home', homeHref],
      ['nav-guitars', guitarsHref],
      ['nav-contact', contactHref],
      ['mobile-nav-home', homeHref],
      ['mobile-nav-guitars', guitarsHref],
      ['mobile-nav-contact', contactHref],
    ];
    map.forEach(([id, href]) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('href', href);
    });
  }

  /* ---------- overlay loading: compara pathname (no href absoluto) ---------- */
  function setupNavLinkLoading() {
    const navIds = ['nav-home', 'nav-guitars', 'nav-contact', 'mobile-nav-home', 'mobile-nav-guitars', 'mobile-nav-contact'];
    navIds.forEach(id => {
      const link = document.getElementById(id);
      if (!link) return;
      link.addEventListener('click', (e) => {
        // obtener pathname del enlace
        const targetPath = new URL(link.href, window.location.origin).pathname.replace(/\/index\.html$/, '/');
        const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
        if (targetPath !== currentPath) {
          const overlay = document.getElementById('loading-overlay');
          if (overlay) overlay.classList.remove('hidden');
        }
        // no preventDefault: dejamos que navegue a la URL real
      });
    });
  }

  /* ---------- active link ---------- */
  function updateActiveLink() {
    const pathname = window.location.pathname.replace(/\/index\.html$/, '/');
    const base = `/${currentLang}`;
    const links = {
      home: ['nav-home', 'mobile-nav-home'],
      guitars: ['nav-guitars', 'mobile-nav-guitars'],
      contact: ['nav-contact', 'mobile-nav-contact']
    };

    // reset
    Object.values(links).flat().forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active');
        el.classList.add('inactive');
      }
    });

    if (pathname === `${base}/` || pathname === `${base}`) {
      links.home.forEach(id => { const el=document.getElementById(id); if(el){el.classList.remove('inactive'); el.classList.add('active')}} );
    } else if (pathname.includes(`${base}/guitarras`)) {
      links.guitars.forEach(id => { const el=document.getElementById(id); if(el){el.classList.remove('inactive'); el.classList.add('active')}} );
    } else if (pathname.includes(`${base}/contacto`)) {
      links.contact.forEach(id => { const el=document.getElementById(id); if(el){el.classList.remove('inactive'); el.classList.add('active')}} );
    }
  }

  /* ---------- toggles UI ---------- */
  function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('hidden');
  }
  function toggleLangDropdown(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    langDropdownOpen = !langDropdownOpen;
    const dd = document.getElementById('lang-dropdown');
    if (!dd) return;
    if (langDropdownOpen) {
      dd.classList.remove('hidden');
      const firstOpt = dd.querySelector('.lang-option');
      if (firstOpt && firstOpt.focus) firstOpt.focus();
      setTimeout(() => { document.addEventListener('click', docCloseHandler); }, 0);
    } else {
      dd.classList.add('hidden');
      document.removeEventListener('click', docCloseHandler);
    }
  }
  function openMobileLangPopup() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
    const popup = document.getElementById('mobile-lang-popup');
    if (popup) popup.classList.remove('hidden');
  }
  function closeMobileLangPopup() {
    const popup = document.getElementById('mobile-lang-popup');
    if (popup) popup.classList.add('hidden');
  }

  /* ---------- cambio de idioma (preserva la ruta) ---------- */
  function changeLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    setCookie('preferred_language', lang, 365);
    currentLang = lang;
    document.documentElement.lang = lang;
    updateTexts();
    setupLinks();
    updateActiveLink();
    // Redirigir a la misma ruta con el primer segmento cambiado/insertado
    const newPath = buildPathWithLang(lang);
    if (newPath !== window.location.pathname) {
      // usaremos replace para no llenar el history innecesariamente
      window.location.replace(newPath);
    }
  }

  /* ---------- initNavbar (NO redirige automáticamente) ---------- */
  function initNavbarInner() {
    // cookie
    const cookieLang = getCookie('preferred_language');
    if (cookieLang === 'es' || cookieLang === 'en') currentLang = cookieLang;
    document.documentElement.lang = currentLang;

    updateTexts();
    setupLinks();
    setupNavLinkLoading();
    updateActiveLink();

    // eventos UI
    const mobileBtn = document.getElementById('mobile-menu-button');
    if (mobileBtn) mobileBtn.addEventListener('click', toggleMobileMenu);

    const langTrigger = document.getElementById('lang-trigger');
    if (langTrigger) {
      langTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLangDropdown(e);
      });
    }

    const ddEs = document.getElementById('lang-option-es');
    const ddEn = document.getElementById('lang-option-en');
    if (ddEs) ddEs.addEventListener('click', () => changeLanguage('es'));
    if (ddEn) ddEn.addEventListener('click', () => changeLanguage('en'));

    const mobileLangBtn = document.getElementById('mobile-lang-button');
    if (mobileLangBtn) mobileLangBtn.addEventListener('click', openMobileLangPopup);
    const mobileLangEs = document.getElementById('mobile-lang-option-es');
    const mobileLangEn = document.getElementById('mobile-lang-option-en');
    if (mobileLangEs) mobileLangEs.addEventListener('click', () => { changeLanguage('es'); closeMobileLangPopup(); });
    if (mobileLangEn) mobileLangEn.addEventListener('click', () => { changeLanguage('en'); closeMobileLangPopup(); });
    const closeLangBtn = document.getElementById('close-lang-popup');
    if (closeLangBtn) closeLangBtn.addEventListener('click', closeMobileLangPopup);

    // No redirigimos aquí por diseño: la página root (/index.html) es la responsable de redireccionar a /es/ o /en/ si procede.
  }

  // Exponer initNavbar globalmente para compatibilidad
  window.initNavbar = initNavbarInner;

  // Función de cierre del dropdown cuando se hace click fuera
  function docCloseHandler(e) {
    const langTrigger = document.getElementById('lang-trigger');
    const langDropdown = document.getElementById('lang-dropdown');
    if (!langDropdown) return;
    if (langDropdown.classList.contains('hidden')) return;
    const target = e.target;
    if ((langTrigger && langTrigger.contains(target)) || langDropdown.contains(target)) {
      return;
    }
    langDropdown.classList.add('hidden');
    langDropdownOpen = false;
    document.removeEventListener('click', docCloseHandler);
  }

  // Función manual de inicialización en caso de que initNavbar no exista (fallback)
  window.initializeNavbarManually = function initializeNavbarManually() {
    console.log('[navbar] inicializando manualmente (fallback)...');
    // Botón de menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }
    // Selector de idioma básico
    const langTrigger = document.getElementById('lang-trigger');
    const langDropdown = document.getElementById('lang-dropdown');
    if (langTrigger && langDropdown) {
      langTrigger.addEventListener('click', (e) => { e.stopPropagation(); langDropdown.classList.toggle('hidden'); });
      document.addEventListener('click', () => langDropdown.classList.add('hidden'));
    }
  };
}

/* ---------- fallback visual si hay error en la carga ---------- */
function createFallbackNavbar() {
  const fallbackNav = `
    <nav style="background-color: #4d0000; padding: 1rem; color: white;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 1.5rem; font-weight: bold;">Guitarras Domingo Fernández</span>
        <div>
          <a href="/es/" style="color: white; margin: 0 10px;">ES</a>
          <a href="/en/" style="color: white; margin: 0 10px;">EN</a>
        </div>
      </div>
    </nav>
  `;
  const container = document.createElement('div');
  container.innerHTML = fallbackNav;
  document.body.insertBefore(container, document.body.firstChild);
}