// app/[lang]/contacto/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useLocaleDictionary } from '../../lib/useLocaleDictionary';
import { useState } from 'react';

export default function ContactPage() {
  // Recuperamos el lang dinámico
  const { lang } = useParams() as { lang?: string };
  const t = useLocaleDictionary(lang || 'es').contact; // fallback

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
        setError(t.contact.errorMsg);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error de conexión. Inténtalo de nuevo.");
      } else {
        setError("Error de conexión. Inténtalo de nuevo.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <div className="mt-8 flex flex-col items-start gap-4">
        <p className="text-2xl">
          {t.contact.phone}: <span className="font-bold">+34 649 805 899</span>
        </p>
        <p className="text-2xl">
          {t.contact.address}: <span className="font-bold">
            {t.contact.addressName}
          </span>
        </p>
      </div>

      {/* Contenedor del formulario centrado */}
      <div className="mt-12 mx-auto w-full max-w-xl bg-red-800 p-8 rounded">
        <h2 className="text-3xl font-bold mb-6 text-center">{t.contact.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t.placeholders.name}
            required
            value={formData.name}
            onChange={handleChange}
            // className="w-full p-3 bg-red-900 text-white border border-red-700 rounded"
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            name="email"
            placeholder={t.placeholders.email}
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            name="subject"
            placeholder={t.placeholders.subject}
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="message"
            placeholder={t.placeholders.message}
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
            {loading ? t.buttons.sending : <strong>{t.buttons.send}</strong>}
          </button>
        </form>
        {success && <p className="text-green-400 mt-4 text-center"><strong>{t.contact.successMsg}</strong></p>}
        {error && <p className="text-red-400 mt-4 text-center"><strong>{error}</strong></p>}
      </div>
    </>
  );
}