
import CourtCard from './CourtCard';

interface Court {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
  status: string;
  image: string;
  isRecommended: boolean;
  amenities: string[];
}

interface CourtsListProps {
  courts: Court[];
  title: string;
  variant?: 'recommended' | 'compact';
}

const CourtsList = ({ courts, title, variant = 'recommended' }: CourtsListProps) => {
  if (courts.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      <div className={variant === 'recommended' ? "space-y-4" : "space-y-3"}>
        {courts.map(court => (
          <CourtCard key={court.id} court={court} variant={variant} />
        ))}
      </div>
    </div>
  );
};

export default CourtsList;
