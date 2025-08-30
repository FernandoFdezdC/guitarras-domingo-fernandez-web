import nodemailer from "nodemailer";

// Mapa para rate limiting en memoria
const rateLimitMap = new Map();

// Configuración de rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 segundos
const MAX_REQUESTS = 5;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

export const handler = async (event) => {
  try {
    // --- Normalizar body
    let data;
    if (typeof event.body === "string") {
      data = JSON.parse(event.body);
    } else {
      data = event.body || event;
    }

    const { name, email, subject, message, origin } = data;

    // --- Validación CORS
    if (!origin || !allowedOrigins.includes(origin)) {
      return { statusCode: 403, body: JSON.stringify({ message: "Not allowed by CORS" }) };
    }

    // --- Rate limiting por IP
    const ip = (event.headers && (event.headers["x-forwarded-for"] || event.headers["x-real-ip"])) || "unknown";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

    if (now - rateData.lastRequest > RATE_LIMIT_WINDOW) {
      rateData.count = 0;
      rateData.lastRequest = now;
    }
    rateData.count++;
    rateData.lastRequest = now;
    rateLimitMap.set(ip, rateData);

    if (rateData.count > MAX_REQUESTS) {
      return { statusCode: 429, body: JSON.stringify({ message: "Rate limit exceeded" }) };
    }

    // --- Validación básica de campos
    if (!name || !email || !subject || !message) {
      return { statusCode: 400, body: JSON.stringify({ message: "Faltan campos obligatorios" }) };
    }

    // --- Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- Envío de correo
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "ferfdezdelcerro@outlook.com",
      subject,
      text: message,
      html: `<p><strong>De:</strong> ${name} (${email})</p><p>${message}</p>`,
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Correo enviado" }) };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Error al enviar el correo", error: error.message }) };
  }
};