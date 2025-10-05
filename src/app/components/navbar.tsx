"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaGlobe } from "react-icons/fa";
import LanguageMobilePopup from "../components/languageMobilePopup";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import { useLocaleDictionary } from '../lib/useLocaleDictionary';

export default function Navbar() {
  // Retrieve language dynamically
  const { lang } = useParams() as { lang?: string };
  const t = useLocaleDictionary(lang || 'es').navbar; // fallback

  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLang, setCurrentLang] = useState<"es" | "en">("es");
  const [langPopupOpen, setLangPopupOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const initialized = useRef(false); // Initialization control

  const langPopupStyle = "absolute top-full mt-2 right-0 bg-[#660000] rounded-lg shadow-lg z-50";
  const langOptionStyle = "px-4 py-2 hover:bg-[#aa2929] text-white cursor-pointer transition-colors";

  
  // Read cookie ONLY after hydration. This runs in the client's browser.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const cookie = document.cookie
      .split("; ")
      .find(row => row.startsWith("preferred_language="));
    // console.log("WARNING. COOKIES ARE BEING READ ON THE USER'S BROWSER!");

    if (cookie) {
      const langFromCookie = cookie.split("=")[1];
      if (langFromCookie === "es" || langFromCookie === "en") {
        setCurrentLang(langFromCookie);
        document.documentElement.lang = langFromCookie;
      }
    }
  }, []);

  // Define router
  const router = useRouter();
  useEffect(() => {
    // Get the current path and modify the language segment
    const currentPath = window.location.pathname; // Example: "/en/inicio" or "/es/contacto"
    const pathParts = currentPath.split("/"); // ["", "en", "inicio"]
    // We assume the language is the first segment (index 1)
    pathParts[1] = currentLang;
    const newPath = pathParts.join("/") || "/";

    // Redirect to new path
    router.push(newPath);
  }, [currentLang, router]);

  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const langPopupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langTriggerRef.current && 
        !langTriggerRef.current.contains(event.target as Node) &&
        langPopupRef.current && 
        !langPopupRef.current.contains(event.target as Node)
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
  
  // Change language via explicit interaction. This also runs in the client's browser
  const changeLanguage = (lang: "es" | "en") => {
    // console.log("changed language");
    document.cookie = `preferred_language=${lang}; path=/; max-age=31536000; SameSite=Strict; Secure`;
    document.documentElement.lang = lang;
    setCurrentLang(lang);
    // console.log("WARNING. COOKIES ARE BEING MODIFIED ON THE USER'S BROWSER!");
  };

  const pathname = usePathname();

  useEffect(() => {
    setIsNavigating(false); // Reset when the route changes
  }, [pathname]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full flex items-center justify-between py-4 px-4 sm:px-8 bg-[#4d0000] transition-transform duration-300">
        <span className="text-3xl font-bold">{t.title}</span>
        {/* Desktop Navigation Links (aligned to right) */}
        <div className="hidden sm:flex gap-6">
          <Link
            href={`/${currentLang}`}
            onClick={() => { if (pathname !== `/${currentLang}`) setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              /^\/[a-zA-Z]{2,3}\/?$/.test(pathname)
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            {t.home}
          </Link>
          <Link
            href={`/${currentLang}/guitarras`}
            onClick={() => { if (pathname !== `/${currentLang}/guitarras`) setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              pathname.endsWith('/guitarras')
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            {t.guitars}
          </Link>
          <Link
            href={`/${currentLang}/contacto`}
            onClick={() => { if (pathname !== `/${currentLang}/contacto`) setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm sm:text-base h-10 px-4 ${
              pathname.endsWith('/contacto')
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#CC3939]"
            } rounded-full`}
          >
            {t.contact}
          </Link>
          {/* Desktop Language Button */}
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
                className={`${langOptionStyle} ${currentLang === 'es' ? 'bg-[#aa2929]' : ''} rounded-t-lg`}
                onClick={() => { changeLanguage("es"); setLangDropdownOpen(false); }}
              >
                <span className="text-sm">🇪🇸</span> Español
              </div>
              <div 
                className={`${langOptionStyle} ${currentLang === 'en' ? 'bg-[#aa2929]' : ''} rounded-b-lg`}
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
            href={`/${currentLang}`}
            onClick={() => {
              if (pathname !== `/${currentLang}`) setIsNavigating(true);
              setMenuOpen(false); // Close mobile menu
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              /^\/[a-zA-Z]{2,3}\/?$/.test(pathname)
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            {t.home}
          </Link>
          <Link
            href={`/${currentLang}/guitarras`}
            onClick={() => { 
              if (pathname !== "/guitarras") setIsNavigating(true);
              setMenuOpen(false); // Close mobile menu
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname.endsWith('/guitarras')
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            {t.guitars}
          </Link>
          <Link
            href={`/${currentLang}/contacto`}
            onClick={() => { 
              if (pathname !== `/${currentLang}/contacto`) setIsNavigating(true);
              setMenuOpen(false); // Close mobile menu
            }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname.endsWith('/contacto')
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
                setLangPopupOpen(true);   // Open language popup
                setMenuOpen(false); // Close mobile menu
              }}
              className="w-full text-white font-medium text-sm h-12 bg-[#660000] hover:bg-[#aa2929] px-4 text-center"
            >
              {t.language}
            </button>
          </div>
        </div>
      )}
      {/* Language Popup */}
      {langPopupOpen && (
        <LanguageMobilePopup
          currentLanguage={currentLang}
          setLanguagePopupOpen={setLangPopupOpen}
          handleLanguageChange={changeLanguage}
        />
      )}
      {isNavigating && (
        <div className="fixed inset-0 bg-black opacity-70 z-50 flex items-center justify-center">
          <span className="text-white text-2xl">{t.loading}</span>
        </div>
      )}
    </>
  );
}