import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Guitars from './pages/guitars/Guitars';
import Contact from './pages/contact/Contact';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección por idioma */}
        <Route path="/" element={<Navigate to="/es/home" replace />} />

        {/* Rutas por idioma */}
        <Route path="/:lang/home" element={<Home />} />
        <Route path="/:lang/guitarras" element={<Guitars />} />
        <Route path="/:lang/contacto" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;