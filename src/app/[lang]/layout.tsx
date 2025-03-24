// app/[lang]/layout.tsx
import type { Metadata } from "next";
import Navbar from "../components/navbar"; // shared component

// You can generate metadata dynamically based on the lang param.
export async function generateMetadata({
  params,
}: {
  params: { lang?: string }; // Make lang optional to handle undefined cases
}): Promise<Metadata> {
  // Ensure params is awaited properly
  const lang = params?.lang ?? "es"; // Default to "es" if lang is undefined

  return {
    title: lang === "en" ? "Domingo Fernández Guitars" : "Guitarras Domingo Fernández",
    description:
      lang === "en"
        ? "Welcome to our English page."
        : "Bienvenido a nuestra página en español.",
  };
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // You can use params.lang to set the <html lang> attribute, etc.
  return (
    <div className="bg-black text-white min-h-screen p-8 sm:p-20">
      <Navbar />
      {children}
    </div>
  );
}