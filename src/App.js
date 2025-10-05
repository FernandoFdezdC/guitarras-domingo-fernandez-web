import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Home from './pages/Home';
import Navbar from "./components/navbar";
import Guitars from './pages/guitars/Guitars';
import Contact from './pages/contact/Contact';
import { useLocaleDictionary } from "./lib/useLocaleDictionary";

/**
 * Layout inline para envolver páginas con Navbar y estilos
 */
function Layout({ children }) {
  const { lang } = useParams();
  const currentLang = lang || "es"; // fallback a español
  const t = useLocaleDictionary(currentLang); // si quieres traducciones

  // Cambiar título según idioma
  useEffect(() => {
    document.title =
      currentLang === "en"
        ? "Domingo Fernández Guitars"
        : "Guitarras Domingo Fernández";
  }, [currentLang]);

  return (
    <div className="bg-[var(--foreground)] text-white min-h-screen p-8 sm:p-20">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

/**
 * Componente principal App
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección por idioma */}
        <Route path="/" element={<Navigate to="/es" replace />} />

        {/* Rutas por idioma */}
        <Route
          path="/:lang"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/:lang/guitarras"
          element={
            <Layout>
              <Guitars />
            </Layout>
          }
        />
        <Route
          path="/:lang/contacto"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;