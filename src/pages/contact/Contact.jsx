// src/pages/contact/Contact.jsx
import { useParams } from 'react-router-dom'; // React Router
import { useLocaleDictionary } from '../../lib/useLocaleDictionary';
import { useState } from 'react';

export default function Contact() {
  // Recuperamos el lang dinámico de la URL
  const { lang } = useParams();
  const t = useLocaleDictionary(lang || 'es').contact; // fallback

  const emailUrl = "https://1ysqxqs6lb.execute-api.eu-south-2.amazonaws.com/prod/contact";
  const loggingUrl = "https://9b1jf394ik.execute-api.eu-south-2.amazonaws.com/prod/errorLog";

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

    console.log("CALL")
    // Check if any required field is empty
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      await fetch(loggingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Form submitted with missing fields",
          origin: window.location.origin,
          formData,
        }),
      });
      setError(t.errorIncomplete || "Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(emailUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          origin: window.location.origin, // for CORS or logging if needed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Send error log to AWS
        await fetch(loggingUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Error submitting form: ${data.message || "Unknown error"}`,
            origin: window.location.origin,
          }),
        });
        setError(data.message || t.errorMsg);
      }
    } catch (err) {
      setError(err.message || "Connection error. Try it again.");
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
          {t.contact.address}: <span className="font-bold">{t.contact.addressName}</span>
        </p>
      </div>

      <div className="mt-12 mx-auto w-full max-w-xl bg-red-800 p-8 rounded">
        <h2 className="text-3xl font-bold mb-6 text-center">{t.contact.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t.placeholders.name}
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500 placeholder-[#C18C8D]"
          />
          <input
            type="email"
            name="email"
            placeholder={t.placeholders.email}
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500 placeholder-[#C18C8D]"
          />
          <input
            type="text"
            name="subject"
            placeholder={t.placeholders.subject}
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500 placeholder-[#C18C8D]"
          />
          <textarea
            name="message"
            placeholder={t.placeholders.message}
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 bg-red-900 text-white border border-red-700 rounded focus:outline-none focus:border-black focus:ring-2 focus:ring-red-500 placeholder-[#C18C8D]"
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