// app/[lang]/layout.tsx
import type { Metadata } from "next";
import Navbar from "../components/navbar"; // shared component
import { ReactNode } from "react";

// Dynamically generate metadata based on the lang parameter
export async function generateMetadata({
  params,
}: {
  params?: { lang?: string };
}): Promise<Metadata> {
  const lang = params?.lang ?? "es"; // Default to "es" if undefined

  return {
    title: lang === "en" ? "Domingo Fernández Guitars" : "Guitarras Domingo Fernández",
    description:
      lang === "en"
        ? "Welcome to our English page."
        : "Bienvenido a nuestra página en español.",
  };
}

// Dynamic layout compatible with Next.js 15
export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: Promise<{ lang?: string }>; // params as an optional promise
}) {
  const resolvedParams = params ? await params : {};
  const lang = resolvedParams?.lang ?? "es"; // Default to "es" if missing
  console.log("language:", lang)

  return (
    <div className="bg-black text-white min-h-screen p-8 sm:p-20">
      <Navbar />
      {children}
    </div>
  );
}