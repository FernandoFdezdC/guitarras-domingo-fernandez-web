"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

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
              pathname === "/" ? "bg-[#aa2929]" : "bg-[#660000] hover:bg-[#aa2929]"
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
                : "bg-[#660000] hover:bg-[#aa2929]"
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
                : "bg-[#660000] hover:bg-[#aa2929]"
            } rounded-full`}
          >
            Contacto
          </Link>
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
            onClick={() => { if (pathname !== "/") setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname === "/" ? "bg-[#aa2929]" : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/guitarras"
            onClick={() => { if (pathname !== "/guitarras") setIsNavigating(true); }}
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
            onClick={() => { if (pathname !== "/contacto") setIsNavigating(true); }}
            className={`transition-colors flex items-center justify-center text-white font-medium text-sm h-12 w-full px-0 border-b-2 border-[#8B0000] text-center ${
              pathname === "/contacto"
                ? "bg-[#aa2929]"
                : "bg-[#660000] hover:bg-[#aa2929]"
            }`}
          >
            Contacto
          </Link>
        </div>
      )}
      {isNavigating && (
        <div className="fixed inset-0 bg-black opacity-70 z-50 flex items-center justify-center">
          <span className="text-white text-2xl">Cargando...</span>
        </div>
      )}
    </>
  );
}