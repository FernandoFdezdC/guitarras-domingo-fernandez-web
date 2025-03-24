"use client";

interface LanguagePopupProps {
  currentLanguage: "es" | "en";
  setCurrentLanguage: (language: "es" | "en") => void;
}

export default function LanguageMobilePopup({ 
  currentLanguage,
  setCurrentLanguage
}: LanguagePopupProps) {
  const handleLanguageChange = (lang: "es" | "en") => {
    console.log(document.cookie);
    console.log(lang);
    setCurrentLanguage(lang);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Add stopPropagation to prevent click from reaching overlay */}
      <div 
        className="bg-[#660000] p-6 rounded-lg w-64"
        onClick={(e) => e.stopPropagation()} // This is the key fix
      >
        <button
          type="button"
          onClick={() => handleLanguageChange("es")}
          className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
            currentLanguage === 'es' 
              ? 'bg-[#AA2929] hover:bg-[#CC3939]' 
              : 'bg-transparent hover:bg-[#8B0000]'
          } text-white mb-2`}
        >
          🇪🇸 Español
        </button>
        
        <button
          type="button"
          onClick={() => handleLanguageChange("en")}
          className={`w-full text-left py-3 px-4 rounded-md transition-colors ${
            currentLanguage === 'en' 
              ? 'bg-[#AA2929] hover:bg-[#CC3939]' 
              : 'bg-transparent hover:bg-[#8B0000]'
          } text-white`}
        >
          🇬🇧 English
        </button>
      </div>
    </div>
  );
}