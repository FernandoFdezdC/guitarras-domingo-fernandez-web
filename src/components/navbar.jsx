import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import LanguageMobilePopup from "./languageMobilePopup";
import { useLocaleDictionary } from "../lib/useLocaleDictionary";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLang, setCurrentLang] = useState("es");
  const [langPopupOpen, setLangPopupOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const initialized = useRef(false);

  const langTriggerRef = useRef(null);
  const langPopupRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Get translations
  const t = useLocaleDictionary(currentLang).navbar;

  // Read cookie after hydration
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check URL first
    const pathLang = location.pathname.split("/")[1];
    if (pathLang === "es" || pathLang === "en") {
      setCurrentLang(pathLang);
      document.documentElement.lang = pathLang;
    } else {
      // Fallback to cookie
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("preferred_language="));
      if (cookie) {
        const langFromCookie = cookie.split("=")[1];
        if (langFromCookie === "es" || langFromCookie === "en") {
          setCurrentLang(langFromCookie);
          document.documentElement.lang = langFromCookie;
        }
      }
    }
  }, []);

  // Handle language change
  const changeLanguage = (lang) => {
    document.cookie = `preferred_language=${lang}; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.documentElement.lang = lang;
    setCurrentLang(lang);
    const pathParts = location.pathname.split("/");
    pathParts[1] = lang;
    navigate(pathParts.join("/") || "/");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        langTriggerRef.current &&
        !langTriggerRef.current.contains(event.target) &&
        langPopupRef.current &&
        !langPopupRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownOpen]);

  // Reset navigating state when location changes
  useEffect(() => {
    setIsNavigating(false);
  }, [location.pathname]);

  const langPopupStyle =
    "absolute top-full mt-2 right-0 bg-[#660000] rounded-lg shadow-lg z-50";
  const langOptionStyle =
    "px-4 py-2 hover:bg-[#aa2929] text-white cursor-pointer transition-colors";

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between py-4 px-4 sm:px-8 bg-[#4d0000] transition-transform duration-300">
        <span className="text-3xl font-bold">{t.title}</span>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-6">
          <Link
            to={`/${currentLang}`}
            onClick={() => {
              if (location.pathname !== `/${currentLang}`)
                setIsNavigating(true);
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              /^\/[a-zA-Z]{2,3}\/?$/.test(location.pathname)
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            {t.home}
          </Link>
          <Link
            to={`/${currentLang}/guitarras`}
            onClick={() => {
              if (location.pathname !== `/${currentLang}/guitarras`)
                setIsNavigating(true);
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              location.pathname.endsWith("/guitarras")
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            {t.guitars}
          </Link>
          <Link
            to={`/${currentLang}/contacto`}
            onClick={() => {
              if (location.pathname !== `/${currentLang}/contacto`)
                setIsNavigating(true);
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              location.pathname.endsWith("/contacto")
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            {t.contact}
          </Link>

          {/* Language Dropdown Desktop */}
          <div className="relative">
            <button
              ref={langTriggerRef}
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="transition-colors flex items-center justify-center text-white h-10 w-10 rounded-full bg-[#660000] hover:bg-[#CC3939] cursor-pointer"
            >
              <FaGlobe className="text-xl" />
            </button>

            {langDropdownOpen && (
              <div ref={langPopupRef} className={langPopupStyle + " overflow-hidden"}>
                <div
                  className={`${langOptionStyle} ${
                    currentLang === "es" ? "bg-[#aa2929]" : ""
                  } rounded-t-lg`}
                  onClick={() => {
                    changeLanguage("es");
                    setLangDropdownOpen(false);
                  }}
                >
                  <span className="text-sm">🇪🇸</span> Español
                </div>
                <div
                  className={`${langOptionStyle} ${
                    currentLang === "en" ? "bg-[#aa2929]" : ""
                  } rounded-b-lg`}
                  onClick={() => {
                    changeLanguage("en");
                    setLangDropdownOpen(false);
                  }}
                >
                  <span className="text-sm">🇬🇧</span> English
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden w-full flex flex-col">
          <Link
            to={`/${currentLang}`}
            onClick={() => {
              if (location.pathname !== `/${currentLang}`) setIsNavigating(true);
              setMenuOpen(false);
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              /^\/[a-zA-Z]{2,3}\/?$/.test(location.pathname)
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            {t.home}
          </Link>
          <Link
            to={`/${currentLang}/guitarras`}
            onClick={() => {
              if (location.pathname !== `/${currentLang}/guitarras`) setIsNavigating(true);
              setMenuOpen(false);
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              location.pathname.endsWith("/guitarras")
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            {t.guitars}
          </Link>
          <Link
            to={`/${currentLang}/contacto`}
            onClick={() => {
              if (location.pathname !== `/${currentLang}/contacto`) setIsNavigating(true);
              setMenuOpen(false);
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              location.pathname.endsWith("/contacto")
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            {t.contact}
          </Link>

          {/* Mobile Language Button */}
          <div className="relative border-b-2 border-[#8B0000]">
            <button
              onClick={() => {
                setLangPopupOpen(true);
                setMenuOpen(false);
              }}
              className="w-full text-white font-medium text-sm h-12 bg-[#660000] hover:bg-[#aa2929] px-4 text-center"
            >
              {t.language}
            </button>
          </div>
        </div>
      )}

      {/* Language Popup Mobile */}
      {langPopupOpen && (
        <LanguageMobilePopup
          currentLanguage={currentLang}
          setLanguagePopupOpen={setLangPopupOpen}
          handleLanguageChange={changeLanguage}
        />
      )}

      {/* Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black opacity-70 z-50 flex items-center justify-center">
          <span className="text-white text-2xl">{t.loading}</span>
        </div>
      )}
    </>
  );
}