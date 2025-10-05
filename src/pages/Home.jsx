
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'; // React Router
import { useLocaleDictionary } from "../lib/useLocaleDictionary";

const slidesData = [
  { text: "", image: "/guitar1.jpg" },
  { text: "", image: "/guitar2.jpg" },
  { text: "", image: "/guitar3.jpg" },
];

export default function Home({ }) {
  const { lang } = useParams();
  const t = useLocaleDictionary(lang || 'es').home; // fallback

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(slidesData);

  useEffect(() => {
    // Update description texts
    setSlides([
      { text: t.guitarDescription1, image: "/guitar1.jpg" },
      { text: t.guitarDescription2, image: "/guitar2.jpg" },
      { text: t.guitarDescription3, image: "/guitar3.jpg" },
    ]);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [t]);

  return (
    <>
      {/* Carousel */}
      <div className="w-full mt-8 flex flex-col sm:flex-row items-center justify-between border-4 border-[#C62828] p-4 sm:p-6 rounded-lg">
        {/* Slide Text */}
        <p className="text-lg sm:max-w-sm">{slides[currentSlide].text}</p>

        {/* Slide Image */}
        <img
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
        <p className="mt-6 text-lg text-justify w-full">{t.descriptionText}</p>
        <p className="mt-6 text-lg text-justify w-full">{t.secondParagraph}</p>
      </div>
    </>
  );
}