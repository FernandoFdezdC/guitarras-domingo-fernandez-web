import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Mapa para rate limiting (solución básica en memoria)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

// Configuración del rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 segundos
const MAX_REQUESTS = 5; // máximo de peticiones por ventana

// Dominios permitidos en CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Función para verificar reCAPTCHA (ajusta según la versión que utilices)
// async function verifyRecaptcha(token: string): Promise<boolean> {
//   const secret = process.env.RECAPTCHA_SECRET;
//   const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     body: `secret=${secret}&response=${token}`,
//   });
//   const data = await res.json();
//   return data.success === true; // Para reCAPTCHA v2. Para v3 podrías validar además el score.
// }

export async function POST(req: Request) {
  // Validar CORS: se obtiene el header Origin y se compara con los permitidos.
  const origin = req.headers.get('origin');
  if (!origin || !allowedOrigins.includes(origin)) {
    return new NextResponse(
      JSON.stringify({ message: 'Not allowed by CORS' }),
      { status: 403 }
    );
  }
  // Se prepara el header para la respuesta
  const responseHeaders = { 'Access-Control-Allow-Origin': allowedOrigins[0] };

  // Rate limiting basado en IP (puedes obtener la IP de distintas maneras)
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const now = Date.now();
  const rateData = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

  // Reiniciar contador si la ventana ha expirado
  if (now - rateData.lastRequest > RATE_LIMIT_WINDOW) {
    rateData.count = 0;
    rateData.lastRequest = now;
  }
  rateData.count++;
  rateLimitMap.set(ip, rateData);

  if (rateData.count > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({ message: 'Rate limit exceeded' }),
      { status: 429, headers: responseHeaders }
    );
  }

  // Obtener datos del body (incluyendo el token de reCAPTCHA)
  const { name, email, subject, message, recaptchaToken } = await req.json();
  console.log("recaptchaToken:", recaptchaToken)

  // Verificar reCAPTCHA
  // const isHuman = await verifyRecaptcha(recaptchaToken);
  // if (!isHuman) {
  //   return new NextResponse(
  //     JSON.stringify({ message: 'reCAPTCHA verification failed' }),
  //     { status: 400, headers: responseHeaders }
  //   );
  // }

  // Configurar el transportador SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que prefieras
    auth: {
      user: process.env.EMAIL_USER, // Define estas variables en .env.local
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "ferfdezdelcerro@outlook.com",
      subject: subject,
      text: message,
      html: `<p><strong>De:</strong> ${name} (${email})</p><p>${message}</p>`,
    });
    return NextResponse.json({ message: "Correo enviado" }, { status: 200 });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return NextResponse.json({ message: "Error al enviar el correo" }, { status: 500 });
  }
}