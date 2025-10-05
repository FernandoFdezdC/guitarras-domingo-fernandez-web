// src/pages/contact/Contact.jsx
import { useParams } from 'react-router-dom'; // React Router
import { useLocaleDictionary } from '../../lib/useLocaleDictionary';
import { useState } from 'react';

export default function Contact() {
  // Recuperamos el lang dinámico de la URL
  const { lang } = useParams();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
        setError(t.errorMsg);
      }
    } catch (err) {
      setError(err.message || "Error de conexión. Inténtalo de nuevo.");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="mt-8 flex flex-col items-start gap-4">
        <p className="text-2xl">
          {t.phone}: <span className="font-bold">+34 649 805 899</span>
        </p>
        <p className="text-2xl">
          {t.address}: <span className="font-bold">{t.addressName}</span>
        </p>
      </div>

      <div className="mt-12 mx-auto w-full max-w-xl bg-red-800 p-8 rounded">
        <h2 className="text-3xl font-bold mb-6 text-center">{t.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t.placeholders.name}
            required
            value={formData.name}
            onChange={handleChange}
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
        {success && <p className="text-green-400 mt-4 text-center"><strong>{t.successMsg}</strong></p>}
        {error && <p className="text-red-400 mt-4 text-center"><strong>{error}</strong></p>}
      </div>
    </>
  );
}