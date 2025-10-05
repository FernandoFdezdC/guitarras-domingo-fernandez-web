// src/pages/guitars/Guitars.jsx
import { useParams } from 'react-router-dom'; // React Router
import { useLocaleDictionary } from '../../lib/useLocaleDictionary';
import GuitarCard from '../../components/guitarCard';

export default function Guitars() {
  const { lang } = useParams();
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