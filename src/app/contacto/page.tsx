"use client";

import { useState } from "react";
import Navbar from "../components/navbar";

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setError("Hubo un problema al enviar el correo.");
      }
    } catch (err) {
      setError("Error de conexión. Inténtalo de nuevo.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-white min-h-screen p-8 sm:p-20">
      <Navbar />
      <div className="mt-8 flex flex-col items-start gap-4">
        <p className="text-2xl">
          Teléfono: <span className="font-bold">+34 649 805 899</span>
        </p>
        <p className="text-2xl">
          Dirección: <span className="font-bold">
            Calle General Moscardó, n.º 16, Navahermosa (Toledo), España
          </span>
        </p>
      </div>

      {/* Contenedor del formulario centrado */}
      <div className="mt-12 mx-auto w-full max-w-xl bg-red-800 p-8 rounded">
        <h2 className="text-3xl font-bold mb-6 text-center">Envíanos un mensaje</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            required
            value={formData.name}
            onChange={handleChange}
            // className="w-full p-3 bg-red-900 text-white border border-red-700 rounded"
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="subject"
            placeholder="Asunto"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="message"
            placeholder="Tu mensaje"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 cursor-pointer text-white font-bold py-3 px-4 rounded text-lg"
            disabled={loading}
          >
            {loading ? "Enviando..." : <strong>Enviar mensaje</strong>}
          </button>
        </form>
        {success && <p className="text-green-400 mt-4 text-center"><strong>¡Mensaje enviado con éxito!</strong></p>}
        {error && <p className="text-red-400 mt-4 text-center"><strong>{error}</strong></p>}
      </div>
    </div>
  );
}