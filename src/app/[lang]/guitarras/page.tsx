// app/[lang]/guitarras/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useLocaleDictionary } from '@/app/lib/useLocaleDictionary';
import GuitarCard from "@/app/components/guitarCard";

export default function Guitarras() {
  // Recuperamos el lang dinámico
  const { lang } = useParams() as { lang?: string };
  const t = useLocaleDictionary(lang || 'es').guitars; // fallback

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {t.map((guitar, index) => (
        <GuitarCard
          key={index}
          image={`/guitar${index + 1}.jpg`}
          title={guitar.title}
          description={guitar.description}
        />
      ))}
    </div>
  );
}