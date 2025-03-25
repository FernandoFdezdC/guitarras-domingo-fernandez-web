// app/[lang]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useLocaleDictionary } from '../lib/useLocaleDictionary';
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  { text: "", image: "/guitar1.jpg" },
  { text: "", image: "/guitar2.jpg" },
  { text: "", image: "/guitar3.jpg" },
];

export default function Home() {
  // Recuperamos el lang dinámico
  const { lang } = useParams() as { lang?: string };
  const t = useLocaleDictionary(lang || 'es').home; // fallback

  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    // Update description texts
    slides[0].text = t.guitarDescription1;
    slides[1].text = t.guitarDescription2;
    slides[2].text = t.guitarDescription3;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [t]);
  
  return (
    <>
      {/* Carousel: full width on mobile, side-by-side on larger screens */}
      <div className="w-full mt-8 flex flex-col sm:flex-row items-center justify-between border-4 border-[#C62828] p-4 sm:p-6 rounded-lg">
        {/* Slide Text */}
        <p className="text-lg sm:max-w-sm">{slides[currentSlide].text}</p>

        {/* Slide Image */}
        <Image
          src={slides[currentSlide].image}
          alt="Guitarra"
          width={300}
          height={200}
          className="rounded-lg mt-4 sm:mt-0"
        />
      </div>

      {/* About Us Section */}
      <div className="w-full flex flex-col px-4 sm:px-8 mt-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">{t.aboutUs}</h2>
        <p className="mt-6 text-lg text-justify w-full">
          {t.descriptionText}
        </p>
        <p className="mt-6 text-lg text-justify w-full">
          {t.secondParagraph}
        </p>
      </div>
    </>
  );
}