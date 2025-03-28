import Image from "next/image";

interface GuitarCardProps {
  image: string;
  title: string;
  description: string;
}

export default function GuitarCard({ image, title, description }: GuitarCardProps) {
  return (
    <div className="border-2 border-red-500 p-4 rounded-lg">
      <Image
        src={image}
        alt={title}
        width={300}
        height={200}
        className="rounded-lg"
      />
      <h3 className="mt-2 text-white font-bold text-2xl">{title}</h3>
      <p className="mt-1 text-white">{description}</p>
    </div>
  );
}