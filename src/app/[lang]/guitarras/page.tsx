import GuitarCard from "../../components/guitarCard"; // Ajusta la ruta según tu estructura

export default function Guitarras() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      <GuitarCard image="/guitar1.jpg" title="guitarra1" description="Descripción de la guitarra 1" />
      <GuitarCard image="/guitar2.jpg" title="guitarra2" description="Descripción de la guitarra 2" />
      <GuitarCard image="/guitar3.jpg" title="guitarra3" description="Descripción de la guitarra 3" />
      {/* Añade más GuitarCard según lo necesites */}
    </div>
  );
}