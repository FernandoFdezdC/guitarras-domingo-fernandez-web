// src/pages/guitars/Guitars.jsx
import { useParams } from 'react-router-dom'; // React Router
import { useLocaleDictionary } from '../../lib/useLocaleDictionary';
import GuitarCard from '../../components/guitarCard';

export default function Guitars() {
  const { lang } = useParams();
  const t = useLocaleDictionary(lang || 'es').guitars; // fallback

  return (
    <>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mt-4 mb-8">
        {t.ourGuitars}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {t.list.map((guitar, index) => (
          <GuitarCard
            key={guitar.id} // better to use id instead of index
            image={`/guitar${index + 1}.jpg`}
            title={guitar.title}
            description={guitar.description}
          />
        ))}
      </div>
    </>
  );
}