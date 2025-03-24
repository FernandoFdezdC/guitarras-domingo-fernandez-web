"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaGlobe } from "react-icons/fa";
import LanguageMobilePopup from "../components/languageMobilePopup";

export default function Navbar() {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLang, setCurrentLang] = useState<"es" | "en">("es");
  const [langPopupOpen, setLangPopupOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const initialized = useRef(false); // Control de inicialización

  const langPopupStyle = "absolute top-full mt-2 right-0 bg-[#660000] rounded-lg shadow-lg z-50";
  const langOptionStyle = "px-4 py-2 hover:bg-[#aa2929] text-white cursor-pointer transition-colors";

  // Leer cookie SOLO después de la hidratación. Esto se ejecuta en el navegador del cliente.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("preferred_language="));
    // console.log("WARNING. COOKIES ARE BEING READ ON THE USER'S BROWSER!");

    if (cookie) {
      const lang = cookie.split("=")[1];
      if (lang === "es" || lang === "en") {
        setCurrentLang(lang);
        document.documentElement.lang = lang;
      }
    }
  }, []);

  // Cambiar idioma con interacción explícita. Esto se ejecuta en el navegador del cliente también
  // Modifica la función para devolver una Promise
  const changeLanguage = (lang: "es" | "en") => {
    // console.log("changed language");
    document.cookie = `preferred_language=${lang}; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.documentElement.lang = lang;
    setCurrentLang(lang);
    // console.log("WARNING. COOKIES ARE BEING MODIFIED ON THE USER'S BROWSER!");
  };

  const langPopupRef = useRef<HTMLDivElement>(null);
  const langTriggerRef = useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(false); // Restablecer cuando cambie la ruta
  }, [pathname]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between py-4 px-4 sm:px-8 bg-[#4d0000] transition-transform duration-300">
        <span className="text-3xl font-bold">Guitarras Domingo Fernández</span>
        {/* Desktop Navigation Links (aligned to right) */}
        <div className="hidden sm:flex gap-6">
          <Link
            href="/"
            onClick={() => { if (pathname !== "/") setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              pathname === "/"
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            Inicio
          </Link>
          <Link
            href="/guitarras"
            onClick={() => { if (pathname !== "/guitarras") setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              pathname === "/guitarras"
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            Guitarras
          </Link>
          <Link
            href="/contacto"
            onClick={() => { if (pathname !== "/contacto") setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              pathname === "/contacto"
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            Contacto
          </Link>
          {/* Botón Idioma Desktop */}
          <div className="relative">
            <button
              ref={langTriggerRef}
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="transition-colors flex items-center justify-center text-white h-10 w-10 rounded-full bg-[#660000] hover:bg-[#CC3939] cursor-pointer"
            >
              <FaGlobe className="text-xl" />
            </button>
            
            {langDropdownOpen && (
            <div ref={langPopupRef} className={langPopupStyle + " overflow-hidden"}> {/* Asegura que los bordes no se solapen */}
              <div 
                className={`${langOptionStyle} ${currentLang === 'es' ? 'bg-[#aa2929]' : ''} rounded-t-lg`} // Redondeo arriba
                onClick={() => { changeLanguage("es"); setLangDropdownOpen(false); }}
              >
                <span className="text-sm">🇪🇸</span> Español
              </div>
              <div 
                className={`${langOptionStyle} ${currentLang === 'en' ? 'bg-[#aa2929]' : ''} rounded-b-lg`} // Redondeo abajo
                onClick={() => { changeLanguage("en"); setLangDropdownOpen(false); }}
              >
                <span className="text-sm">🇬🇧</span> English
              </div>
            </div>
          )}
          </div>
        </div>
        {/* Mobile Hamburger Button */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Dropdown Navigation (displayed below the navbar) */}
      {menuOpen && (
        <div className="sm:hidden w-full flex flex-col">
          <Link
            href="/"
            onClick={() => { 
              if (pathname !== "/") setIsNavigating(true);
              setMenuOpen(false); // Cerrar menú móvil
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname === "/" ? "bg-[#aa2929]" : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/guitarras"
            onClick={() => { 
              if (pathname !== "/guitarras") setIsNavigating(true);
              setMenuOpen(false); // Cerrar menú móvil
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname === "/guitarras"
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            Guitarras
          </Link>
          <Link
            href="/contacto"
            onClick={() => { 
              if (pathname !== "/contacto") setIsNavigating(true);
              setMenuOpen(false); // Cerrar menú móvil
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname === "/contacto"
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            Contacto
          </Link>
          {/* Botón Idioma Mobile */}
          <div className="relative border-b-2 border-[#8B0000]">
            <button
              onClick={() => {
                setLangPopupOpen(true);   // Abre el popup de idioma
                setMenuOpen(false); // Cerrar menú móvil
              }}
              className="w-full text-white font-medium text-sm h-12 bg-[#660000] hover:bg-[#aa2929] px-4 text-center"
            >
              Idioma
            </button>
          </div>
        </div>
      )}
      {/* Popup de Idioma */}
      {langPopupOpen && (
        <LanguageMobilePopup
          currentLanguage={currentLang}
          setLanguagePopupOpen={setLangPopupOpen}
          handleLanguageChange={changeLanguage}
        />
      )}
      {isNavigating && (
        <div className="fixed inset-0 bg-black opacity-70 z-50 flex items-center justify-center">
          <span className="text-white text-2xl">Cargando...</span>
        </div>
      )}
    </>
  );
}