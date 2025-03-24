// app/[lang]/layout.tsx
import type { Metadata } from "next";
import Navbar from "../components/navbar"; // shared component

// You can generate metadata dynamically based on the lang param.
export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { lang } = params;

  // Example: Define metadata for English and Spanish.
  if (lang === "en") {
    return {
      title: "Guitars - English",
      description: "Welcome to our English page.",
    };
  }
  return {
    title: "Guitarras - Español",
    description: "Bienvenido a nuestra página en español.",
  };
}

export default function LangLayout({
  children,
  params,
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