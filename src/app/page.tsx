"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  { text: "Guitarras artesanales hechas a mano con la mejor madera.", image: "/guitar1.jpg" },
  { text: "El sonido perfecto para los músicos más exigentes.", image: "/guitar2.jpg" },
  { text: "Tradición y calidad en cada detalle.", image: "/guitar3.jpg" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center">Sobre Nosotros</h2>
        <p className="mt-6 text-lg text-justify w-full">
          Texto de ejemplo sobre la empresa y sus guitarras. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="mt-6 text-lg text-justify w-full">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>
    </>
  );
}